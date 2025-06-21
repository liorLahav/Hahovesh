import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  const {isAuthenticated} = useUserContext();

  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([]);
    }
    else{
      const unsubscribe = subscribeToMessages((fetchedMessages, error) => {
        if (error) {
          console.error("שגיאה בטעינת הודעות:", error);
          setLoadingMessages(false);
          return;
        }
        setMessages(fetchedMessages || []);
        setLoadingMessages(false);
        return () => unsubscribe();
      });
    }
  }, [isAuthenticated]);

  return (
    <MessagesContext.Provider value={{ messages, loadingMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
