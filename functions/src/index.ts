import { onValueCreated } from "firebase-functions/v2/database";
import * as admin from "firebase-admin";
import { Expo, ExpoPushMessage } from "expo-server-sdk";

admin.initializeApp();
const expo = new Expo();

export const onNewMessage = onValueCreated(  {
  region: "europe-west1",
  ref: "/messages/{messageId}"  
}, async (event) => {
  const messageData = event.data?.val();

  const title = messageData?.urgency === "high" ? "🚨 הודעה דחופה" : "📢התקבלה הודעה";
  const body = messageData?.message_description|| "";

  const tokens: string[] = [];

  const volunteersSnap = await admin.firestore().collection("volunteers").get();
  volunteersSnap.forEach(doc => {
    const token = doc.get("expoPushToken");
    if (token && Expo.isExpoPushToken(token) &&(messageData.distribution_by_role === "All" || doc.get("permissions").includes(messageData.distribution_by_role))) {
      tokens.push(token);
    }
  });

  const messages: ExpoPushMessage[] = tokens.map(token => ({
    to: token,
    sound: "default",
    title,
    body,
  }));

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    console.log("📤 Sent to", tokens.length, "devices");
  } catch (err) {
    console.error("❌ Error sending push:", err);
  }
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
  const body = eventData?.anamnesis || "";

  const tokens: string[] = [];

  const volunteersSnap = await admin.firestore().collection("volunteers").get();
  volunteersSnap.forEach(doc => {
    const token = doc.get("expoPushToken");
    if (token && Expo.isExpoPushToken(token)) {
      tokens.push(token);
    }
  });

  const messages: ExpoPushMessage[] = tokens.map(token => ({
    to: token,
    sound: "default",
    title,
    body,
  }));

  try {
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    console.log("📤 Sent to", tokens.length, "devices");
  } catch (err) {
    console.error("❌ Error sending push:", err);
  }
});