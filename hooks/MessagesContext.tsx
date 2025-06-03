import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Message, subscribeToMessages } from "@/services/messages";

// טיפוס חדש לאובייקט שנחזיר
type MessagesContextType = {
  messages: Message[];
  loadingMessages: boolean;
};

// יצירת context עם ערך ברירת מחדל
const MessagesContext = createContext<MessagesContextType>({
  messages: [],
  loadingMessages: true,
});

export const useMessages = () => useContext(MessagesContext);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((fetchedMessages, error) => {
      if (error) {
        console.error("שגיאה בטעינת הודעות:", error);
        setLoadingMessages(false);
        return;
      }
      setMessages(fetchedMessages || []);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <MessagesContext.Provider value={{ messages, loadingMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
