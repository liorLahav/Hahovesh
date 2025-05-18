import { realtimeDb } from "@/FirebaseConfig";
import { get, onChildAdded, onValue, push, ref, serverTimestamp, set } from "firebase/database";

type Event = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  anamnesis: string;
  street: string;
};

const subscribeToEvents = (
  callback: (events: any[] | null, error?: Error) => void
) => {
  const eventsRef = ref(realtimeDb, "events");

  const unsubscribe = onValue(
    eventsRef,
    (snapshot) => {
      try {
        const data = snapshot.val();
        if (data && typeof data === "object") {
          callback(Object.values(data));
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

const createEvent = async (
  values: Record<string, string>,
  onReset: () => void
): Promise<void>  => {
  try {
    const node = push(ref(realtimeDb, 'events'));
    await set(node, {
      ...values,
      createdAt: serverTimestamp(),
    });
    onReset();
    return;
  } catch (error: any) {
    // Propagate error with context
    throw new Error(
      'Error saving event: ' + (error?.message || JSON.stringify(error))
    );
  }
}

export { Event, subscribeToEvents,createEvent };
