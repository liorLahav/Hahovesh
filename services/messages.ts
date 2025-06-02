import { ref, push, set, onValue, remove, update } from "firebase/database";
import { realtimeDb } from "@/FirebaseConfig";
import { userHasRoles } from "./userHasRoles";

export type Message = {
  message_id: string;
  message_description: string;
  distribution_by_role: string;
  date: string;
  time: string;
  sender_id: string;
  read_by?: { [userId: string]: boolean };
};

export const sendMessageToDB = async (messageData: {
  [key: string]: string;
}) => {
  const now = new Date();
  const date = now.toLocaleDateString("he-IL");
  const time = now.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messagesRef = ref(realtimeDb, "messages");
  const newMessageRef = push(messagesRef); // create a new message reference and unique key

  const fullMessage = {
    ...messageData,
    date,
    time,
    sender_id: "admin123", // replace with actual sender ID
    message_id: newMessageRef.key,
    // read_by: {},
  };
  console.log("fullMessage:", fullMessage);

  await set(newMessageRef, fullMessage);
};

export const subscribeToMessages = (
  callback: (messages: Message[] | null, error?: Error) => void
) => {
  const messagesRef = ref(realtimeDb, "messages");

  const unsubscribe = onValue(
    messagesRef,
    (snapshot) => {
      try {
        const data = snapshot.val();
        if (data && typeof data === "object") {
          // ממיר את ה־object לרשימה רגילה + מוסיף את ה־message_id מתוך המפתח
          const messages: Message[] = Object.entries(data).map(
            ([key, value]) => ({
              ...(value as any),
              message_id: key,
            })
          );
          callback(messages);
        } else {
          callback([]);
        }
      } catch (err) {
        callback(null, err as Error);
      }
    },
    (error) => {
      callback(null, error);
    }
  );

  return unsubscribe;
};

export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = ref(realtimeDb, `messages/${messageId}`);
    await remove(messageRef);
    console.log(`Message with ID ${messageId} deleted successfully.`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    } else {
      console.error("Unexpected error while deleting message:", error);
    }
  }
};

export const deleteAllMessages = async () => {
  try {
    const messagesRef = ref(realtimeDb, `messages`);
    await remove(messagesRef);
    console.log("all messages deleted");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to deleted messages");
    } else {
      console.error("Unexpected error while deleting messages");
    }
  }
};

export const markMessagesAsRead = async (
  userId: string,
  messages: Message[],
  userRoles: string[]
) => {
  const updates: Record<string, any> = {};

  messages.forEach((msg) => {
    const shouldSee =
      msg.distribution_by_role === "All" ||
      userHasRoles(userRoles, msg.distribution_by_role);

    if (shouldSee && !msg.read_by?.[userId]) {
      updates[`messages/${msg.message_id}/read_by/${userId}`] = true;
    }
  });

  if (Object.keys(updates).length > 0) {
    await update(ref(realtimeDb), updates);
  }
};
