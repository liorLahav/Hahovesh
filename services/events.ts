import { realtimeDb } from "@/FirebaseConfig";
import {
  get,
  onChildAdded,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
  remove,
} from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Event = {
  anamnesis?: string;
  apartment_details?: string;
  createdAt: number;
  haznk_code?: string;
  informat_location?: string;
  location_type?: string;
  medical_code?: string;
  patient_age?: string;
  patient_name?: string;
  patient_sex?: string;
  phone_number1?: string;
  phone_number2?: string;
  recipient?: string;
  street?: string;
  urgency?: string;
  id: string;
};

const deleteEvent = async (eventId: string) => {
  try {
    const eventRef = ref(realtimeDb, `events/${eventId}`);
    await remove(eventRef);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error deleting event: " + error.message);
    } else {
      throw new Error("Unknown error deleting event: " + JSON.stringify(error));
    }
  }
};

const updateEvent = async (eventId: string, updatedEvent: Event) => {
  const eventRef = ref(realtimeDb, `events/${eventId}`);
  await set(eventRef, updatedEvent);
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
          for (const [key, value] of Object.entries(data)) {
            (value as any)["id"] = key;
          }
          callback(Object.values(data));
        } else {
          callback([]);
        }
      } catch (err) {
        callback(null, err as Error);
      }
    },
    (error) => {
      // טיפול בשגיאה של Firebase עצמה (לא snapshot)
      callback(null, error);
    }
  );
  return unsubscribe;
};

export const subscribeToEventsById = (
  id: string,
  callback: (event: Event | null, error?: Error) => void
) => {
  const eventsRef = ref(realtimeDb, "events/" + id);
  const unsubscribe = onValue(
    eventsRef,
    (snapshot) => {
      try {
        const data = snapshot.val();
        if (data && typeof data === "object") {
          callback(data);
        } else {
          callback(null);
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
): Promise<void> => {
  try {
    const node = push(ref(realtimeDb, "events"));
    const id = node.key;

    await set(node, {
      id,
      ...values,
      createdAt: serverTimestamp(),
    });

    onReset();
    return;
  } catch (error: any) {
    throw new Error(
      "Error saving event: " + (error?.message || JSON.stringify(error))
    );
  }
};

export { Event, subscribeToEvents, createEvent };
