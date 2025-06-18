import { listenToRTDBConnection } from "@/services/server";
import { createContext, use, useContext, useRef } from "react";
import { useEffect, useState } from "react";

type OnlineContextType = {
  isOnline: boolean;
}


const onlineContext = createContext<OnlineContextType | null>(null);

export const OnlineProvider = ({ children }: { children: React.ReactNode } ) => {
    const [isOnline, setIsOnline] = useState(true);
    const usbscribeRef = useRef<() => void | undefined>(undefined);
    
    const changeOnlineStatus = (status: boolean) => {
        setIsOnline(status);
    };
    useEffect(() => {
        const run = async () => {
          const unsub = await listenToRTDBConnection((status) => {
            changeOnlineStatus(status);
        });
          usbscribeRef.current = unsub;
        };
        run();
        return () => {
          if (usbscribeRef.current) {
            usbscribeRef.current();
          }
        };
    }, []);
    
    return (
        <onlineContext.Provider value={{ isOnline}}>
        {children}
        </onlineContext.Provider>
    );

};

export const useOnlineContext = () => {
    const ctx = useContext(onlineContext);
    if (!ctx)
        throw new Error("useOnlineContext must be used inside OnlineProvider");
    return ctx;
}