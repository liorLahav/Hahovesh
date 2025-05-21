import { ref, push, set } from "firebase/database";
import { realtimeDb } from "@/FirebaseConfig"; 

const sendMessageToDB = async (messageData: { [key: string]: string }) => {
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
  };

  await set(newMessageRef, fullMessage);
};
export { sendMessageToDB };
