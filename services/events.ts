import { realtimeDb } from "@/FirebaseConfig";
import { get, onChildAdded, onValue, ref } from "firebase/database";

/**
 * 
 * getEvents useless now using subscribeToEvents
 * onChildAppend useless now using subscribeToEvents
 */

const getEvents = async () => {
  try {
    const eventsRef = ref(realtimeDb, "events");
    const data = await get(eventsRef);
    if (!data.exists()) {
      return null;
    }
    return data.val();
  } catch (error) {
    console.error("Error fetching events: ", error);
    return null;
  }
};

const onChildAppend = (callback: (data: any) => void) => {
  const eventsRef = ref(realtimeDb, "events");
  onChildAdded(eventsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};

const subscribeToEvents = (callback: (events: any[]) => void) => {
  const eventsRef = ref(realtimeDb, "events");

  const unsubscribe = onValue(eventsRef, (snapshot) => {
    const data = snapshot.val();
    if (data && typeof data === "object") {
      callback(Object.values(data));
    } else {
      callback([]);
    }
  });

  return unsubscribe;
};

export { getEvents, onChildAppend, subscribeToEvents };
