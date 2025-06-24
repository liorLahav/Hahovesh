import { createContext, use, useContext, useRef } from "react";
import { useEffect, useState } from "react";
import { Event, subscribeToEventsById } from "@/services/events";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnlineContext } from "./OnlineContext";

type EventContextType = {
    event : Event;
    isEventActive : boolean;
    changeActiveStatus : (status : boolean) => void;
    changeEvent : (event: Event) => void;
    refreshEvent : () => Promise<(() => void) | undefined>;
}

const safeSetJSON = async (key: string, value: unknown) => {  
  if (value === undefined || value === null) return;           
  await AsyncStorage.setItem(key, JSON.stringify(value));     
};

const eventContext =  createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: React.ReactNode } ) => {
    const [event, setEvent] = useState<Event>({} as Event);
    const unsubscribeRef = useRef<() => void | undefined>(undefined);
    const [isEventActive, setIsEventActive] = useState(false);
    const {isOnline} = useOnlineContext();
    
    const changeEvent = async (event: Event) => {
        setEvent(event);
        changeActiveStatus(true);
        await safeSetJSON("event", event); 
    }    
    
    const refreshEvent = async () => {
        unsubscribeRef.current?.();
        const unsubscribe = subscribeToEventsById(event.id, async (fetchedEvent, error) => {
            if (fetchedEvent) {
                setEvent(fetchedEvent);
                await safeSetJSON("event", fetchedEvent); 
            }
            else{
                try {
                    const e = await AsyncStorage.getItem("event"); 
                    console.log("Event found in storage:", e);
                    if (e) {
                        const parsedEvent = JSON.parse(e);
                        setEvent(parsedEvent);
                    } else {
                        console.log("No event found");
                    }
                } catch (error) {
                    console.log("Error fetching event from storage:", error);
                }
            }
        });
        return () => unsubscribe();
    }

    const changeActiveStatus = (status : boolean) => {
        setIsEventActive(status);
        if (isEventActive) {
            refreshEvent();
            safeSetJSON("event", event); 
        }
        else {
            unsubscribeRef.current?.();
            AsyncStorage.removeItem("event");
        }
    }


    useEffect(() => {
        const run = async () => {
          const unsub = await refreshEvent();
          unsubscribeRef.current = unsub;
        };
      
        run();
      
        return () => {
          if (unsubscribeRef.current) {
            unsubscribeRef.current();
          }
        };
      }, []);
      useEffect(() => {
        if (!isOnline) {
            const fetchEvent = async () => {
                try {
                    const e = await AsyncStorage.getItem("event");
                    if (e) {
                        const parsedEvent = JSON.parse(e);
                        setEvent(parsedEvent);
                    } else {
                        console.log("No event found");
                    }
                }
                catch (error) {
                    console.log("Error fetching event from storage:", error);
                }
            };
            fetchEvent();
        }
        }, [isOnline]);
      
    return <eventContext.Provider value={{ event,isEventActive,changeEvent,changeActiveStatus, refreshEvent }}>
        {children}
    </eventContext.Provider>
}

export const useEventContext = () => {
    const ctx = useContext(eventContext);
    if (!ctx) throw new Error("useEventContext must be used inside EventProvider");
    return ctx;
};