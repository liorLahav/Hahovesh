// context/MessagesContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Message, subscribeToMessages } from "@/services/messages";

// 1. יצירת context
const MessagesContext = createContext<Message[]>([]);
const MessagesUpdateContext = createContext<() => void>(() => {});

// 2. hook לשימוש נוח
export const useMessages = () => useContext(MessagesContext);
export const useRefreshMessages = () => useContext(MessagesUpdateContext);

// 3. Provider
export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // הפונקציה תרענן אבל לא תחזיר unsubscribe
  const refreshMessages = () => {
    subscribeToMessages((fetchedMessages, error) => {
      if (error) {
        console.error("שגיאה בטעינת הודעות:", error);
        setLoadingMessages(false);
        return;
      }
      setMessages(fetchedMessages || []);
      setLoadingMessages(false);
    });
  };

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
    <MessagesContext.Provider value={messages}>
      <MessagesUpdateContext.Provider value={refreshMessages}>
        {children}
      </MessagesUpdateContext.Provider>
    </MessagesContext.Provider>
  );
}

