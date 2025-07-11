import database from '@react-native-firebase/database';

const hasRole = (roles: string[], role: string): boolean => {
  return roles.includes(role);
};

export type Message = {
  message_id: string;
  message_description: string;
  distribution_by_role: string;
  date: string;
  time: string;
  sender_id: string;
  read_by?: { [userId: string]: boolean };
  urgency?: boolean;
};

export const sendMessageToDB = async (
  message_description: string,
  distribution_by_role: string,
  sender_id: string,
  urgency?: boolean
) => {
  const now = new Date();
  const date = now.toLocaleDateString("he-IL");
  const time = now.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messagesRef = database().ref("messages");
  const newMessageRef = messagesRef.push();

  const fullMessage = {
    message_description,
    distribution_by_role,
    date,
    time,
    sender_id,
    read_by: { [sender_id]: true },
    message_id: newMessageRef.key,
    urgency: urgency || false,
  };
  console.log("fullMessage:", fullMessage);

  await newMessageRef.set(fullMessage);
};

export const subscribeToMessages = (
  callback: (messages: Message[] | null, error?: Error) => void
) => {
  const messagesRef = database().ref("messages");

  const listener = messagesRef.on(
    'value',
    (snapshot) => {
      try {
        const data = snapshot.val();
        if (data && typeof data === "object") {
          const messages: Message[] = Object.entries(data).map(
            ([key, value]) => ({
              ...(value as any),
              message_id: key,
            })
          );

          if (messages.length > 30) {
            const sorted = [...messages].sort((a, b) => {
              const aDate = new Date(`${a.date} ${a.time}`);
              const bDate = new Date(`${b.date} ${b.time}`);
              return -aDate.getTime() + bDate.getTime(); // ישנות קודם
            });

            const messagesToDelete = sorted.slice(0, messages.length - 30);

            messagesToDelete.forEach((msg) => {
              const msgRef = database().ref(`messages/${msg.message_id}`);
              msgRef.remove().catch((err) =>
                console.error("שגיאה במחיקת הודעה ישנה:", err)
              );
            });
          }

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

  return () => messagesRef.off('value', listener);
};

export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = database().ref(`messages/${messageId}`);
    await messageRef.remove();
    console.log(`Message with ID ${messageId} deleted successfully.`);
  } catch (error: any) {
    throw new Error(`Failed to delete message: ${error?.message || JSON.stringify(error)}`);
  }
};

export const deleteAllMessages = async () => {
  try {
    const messagesRef = database().ref(`messages`);
    await messagesRef.remove();
    console.log("All messages deleted.");
  } catch (error: any) {
    throw new Error(`Failed to delete all messages: ${error?.message || JSON.stringify(error)}`);
  }
};

export const markMessagesAsRead = async (
  userId: string,
  messages: Message[],
  roles: string[] = []
) => {
  console.log("markMessagesAsRead called with userId:", userId, "roles:", roles);
  const updates: Record<string, any> = {};

  messages.forEach((msg) => {
    const shouldSee =
      msg.distribution_by_role === "All" || hasRole(roles, msg.distribution_by_role);
    if (shouldSee && !msg.read_by?.[userId]) {
      updates[`messages/${msg.message_id}/read_by/${userId}`] = true;
    }
  });

  if (Object.keys(updates).length > 0) {
    await database().ref().update(updates);
  }
};
