import { realtimeDb } from "@/FirebaseConfig";
import { get, onChildAdded, onValue, push, ref, serverTimestamp, set } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  id : string;
};

export type OperationPayload = {
  option: string;
  text: string | null;
  timestamp: number;
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
}

const createEvent = async (
  values: Record<string, string>,
  onReset: () => void
): Promise<void> => {
  try {
    const node = push(ref(realtimeDb, 'events'));
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
      'Error saving event: ' + (error?.message || JSON.stringify(error))
    );
  }
};

const sendEventOperation = async (
  eventId: string,
  payload: OperationPayload
): Promise<void> => {
  try {
    const opsRef = ref(realtimeDb, `events/${eventId}/operations`);
    const newOpRef = push(opsRef);
    await set(newOpRef, {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(
      "Error sending event operation: " +
        (error.message || JSON.stringify(error))
    );
  }
};


const addVolunteerToEvent = async (
  eventId: string,
  volunteerId: string
): Promise<void> => {
  try {
    const eventRef = ref(realtimeDb, `events/${eventId}/volunteers/${volunteerId}`);
    await set(eventRef, { volunteerId, joinedAt: serverTimestamp() });
  } catch (error: any) {
    throw new Error(
      'Error adding volunteer to event: ' + (error?.message || JSON.stringify(error))
    );
  }
}

const removeVolunteerFromEvent = async (
  eventId: string,
  volunteerId: string
): Promise<void> => {
  try {
    const eventRef = ref(realtimeDb, `events/${eventId}/volunteers/${volunteerId}`);
    await set(eventRef, null);
  } catch (error: any) {
    throw new Error(
      'Error removing volunteer from event: ' + (error?.message || JSON.stringify(error))
    );
  }
}

export { Event, subscribeToEvents,createEvent,addVolunteerToEvent,removeVolunteerFromEvent, sendEventOperation };
