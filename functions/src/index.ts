import * as admin from "firebase-admin";
import { onValueCreated } from "firebase-functions/v2/database";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { onCall } from "firebase-functions/https";

admin.initializeApp();
const expo = new Expo();

export const onNewMessage = onValueCreated({
  region: "europe-west1",
  ref: "/messages/{messageId}"
}, async (event) => {
  const messageData = event.data?.val();
  if (!messageData) {
    console.log("No message data found.");
    return;
  }

  const title = messageData.urgency === true ? "🚨 הודעה דחופה" : "📢 התקבלה הודעה";
  const body = messageData.message_description || "";
  const senderId = messageData?.sender_id; // Get the sender's ID

  // Separate tokens into Expo tokens vs. native device tokens
  const expoTokens: string[] = [];
  const deviceTokens: string[] = [];

  // Fetch volunteers
  const volunteersSnap = await admin.firestore().collection("volunteers").get();
  volunteersSnap.forEach(doc => {
    const token = doc.get("expoPushToken");
    if (typeof token !== "string") return;

    // Don't send notification to the sender
    if (doc.id === senderId) return;

    // Check if volunteer can receive this message
    const canReceive =
      (messageData.distribution_by_role === "All" || doc.get("permissions").includes(messageData.distribution_by_role)) && (doc.get("status") === "available" || messageData.urgency == false);

    if (canReceive) {
      if (Expo.isExpoPushToken(token)) {
        expoTokens.push(token);
      } else {
        deviceTokens.push(token);
      }
    }
  });

  // 1) Send notifications to Expo tokens
  const expoMessages: ExpoPushMessage[] = expoTokens.map(to => ({
    to,
    title,
    body,
    channelId: messageData.urgency === true ? 'urgent' : 'default'
  }));

  try {
    const chunks = expo.chunkPushNotifications(expoMessages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    console.log("📤 Sent push to", expoTokens.length, "Expo devices");
  } catch (error) {
    console.error("❌ Error sending Expo push:", error);
  }

  // 2) Send notifications to native device tokens (FCM/APNs)
  const fcmMessages = deviceTokens.map(token => ({
    token,
    notification: { title, body },
    android: {
      notification: {
        channelId: messageData.urgency === true ? 'urgent' : 'default',
        sound: messageData.urgency === true ? 'urgent' : 'default',
      },
    },
    apns: {
      payload: {
        aps: { sound: messageData.urgency === true ? 'urgent' : 'default' },
      },
    },
  }));

  for (const msg of fcmMessages) {
    try {
      await admin.messaging().send(msg);
    } catch (err) {
      console.error("❌ Error sending device token push:", err);
    }
  }

  console.log("📤 Sent push to", deviceTokens.length, "native devices");
});

export const onNewEvent = onValueCreated({
  region: "europe-west1",
  ref: "/events/{eventId}"
}, async (event) => {
  const eventData = event.data?.val();
  if (!eventData) {
    console.error("❌ No event data found");
    return;
  }

  const title = "התקבל אירוע חדש";
  const body = eventData?.medical_code || "";
  const senderId = eventData?.sender_id; // Get the sender's ID

  const volunteersSnap = await admin.firestore().collection("volunteers").get();
  const expoTokens: string[] = [];
  const deviceTokens: string[] = [];

  volunteersSnap.forEach(doc => {
    const token = doc.get("expoPushToken");
    if (typeof token !== 'string') return;
    
    // Don't send notification to the sender
    if (doc.id === senderId) return;
    
    if (doc.get("status") === "available"){
      if (Expo.isExpoPushToken(token)) {
        expoTokens.push(token);
      } else {
        // assume it's a native FCM/APNs token
        deviceTokens.push(token);
      }
    }
  });

  // 1) Expo pushes
  const expoMessages: ExpoPushMessage[] = expoTokens.map(to => ({
    to,
    title,
    body,
    channelId: 'events', // use the channel created in app.config.ts
  }));
  
  try {
    for (const chunk of expo.chunkPushNotifications(expoMessages)) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    console.log("📤 Sent push to", expoTokens.length, "Expo devices");
  } catch (error) {
    console.error("❌ Error sending Expo push:", error);
  }

  // 2) Native FCM/APNs pushes
  const fcmMessages = deviceTokens.map(token => ({
    token,
    notification: { title, body },
    android: { notification: { channelId: 'events', sound: 'events.wav' } },
    apns: { payload: { aps: { sound: 'events.wav' } } },
  }));
  
  for (const msg of fcmMessages) {
    try {
      await admin.messaging().send(msg);
    } catch (err) {
      console.error("❌ Error sending device token push:", err);
    }
  }
  
  console.log("📤 Sent push to", deviceTokens.length, "native devices");
});

export const validateUser = onCall(async (request) => {
  const phone = request.data.phoneNumber;
  const id = request.data.id;
  if (!phone || !id) {
    return { valid: false, error: "Missing phone number or ID"};
  }
  const userSnap = await admin.firestore().collection("volunteers").doc(id).get();
  if (!userSnap.exists) {
    return { valid: false, error: "הטלפון או תעודת הזהות לא נכונים"};
  }
  const userData = userSnap.data();
  console.debug("User snapshot:", userSnap.exists, userSnap.data());
  if (userData?.phone !== phone) {
    return { valid: false, error: "הטלפון או תעודת הזהות לא נכונים" };
  }
  return { valid: true, userId: id };
 });

export const registerUser = onCall(async (request) => {
  const { firstName, lastName, identifier, phone } = request.data;
  
  // Validate required fields
  if (!firstName || !lastName || !identifier || !phone) {
    return { 
      success: false, 
      error: "Missing required fields" 
    };
  }

  try {
    // Check if ID already exists
    const idDocRef = admin.firestore().collection("volunteers").doc(identifier);
    const idDocSnap = await idDocRef.get();

    if (idDocSnap.exists) {
      const existingData = idDocSnap.data();
      return {
        success: false,
        conflict: "id",
        details: existingData
      };
    }

    // Check if phone already exists
    const phoneQuery = admin.firestore()
      .collection("volunteers")
      .where("phone", "==", phone);
    const phoneQuerySnapshot = await phoneQuery.get();

    if (!phoneQuerySnapshot.empty) {
      const existingData = phoneQuerySnapshot.docs[0].data();
      return {
        success: false,
        conflict: "phone",
        details: existingData
      };
    }

    // Create new user
    await idDocRef.set({
      first_name: firstName,
      last_name: lastName,
      id: identifier,
      phone: phone,
      permissions: ["Pending"],
      status: "available",
    });

    console.log(`✅ User registered successfully: ${firstName} ${lastName} (${identifier})`);
    
    return { success: true };

  } catch (error) {
    console.error("❌ Error registering user:", error);
    return { 
      success: false, 
      error: "Internal server error" 
    };
  }
});

