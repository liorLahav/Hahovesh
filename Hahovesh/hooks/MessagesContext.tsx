import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { Message, subscribeToMessages } from "@/services/messages";
import { useUserContext } from "./UserContext";

type MessagesContextType = {
  messages: Message[];
  loadingMessages: boolean;
};

const MessagesContext = createContext<MessagesContextType>({
  messages: [],
  loadingMessages: true,
});

export const useMessages = () => useContext(MessagesContext);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const { isAuthenticated } = useUserContext();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([]);
      setLoadingMessages(false);

      // Clean up existing subscription
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    } else {
      const unsubscribe = subscribeToMessages((fetchedMessages, error) => {
        if (error) {
          console.error("שגיאה בטעינת הודעות:", error);
          setLoadingMessages(false);
          return;
        }
        setMessages(fetchedMessages || []);
        setLoadingMessages(false);
      });

      // Store the unsubscribe function in ref
      unsubscribeRef.current = unsubscribe;
    }

    // Cleanup function for useEffect
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isAuthenticated]);

  return (
    <MessagesContext.Provider value={{ messages, loadingMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
