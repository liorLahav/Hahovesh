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
  update,
} from "firebase/database";


export type Event = {
  anamnesis?: string;
  apartment_details?: string;
  createdAt: string;
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
  house_number?: string;
  isActive?: boolean;
  canceledAt?: number;
  volunteers?: Record<string, { volunteerId: string; joinedAt: number , arrivedAt?: number }>;
  summaryReportFiller?: string;
};

export const deleteEvent = async (eventId: string) => {
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

export const updateEvent = async (eventId: string, updatedEvent: Event) => {
  const eventRef = ref(realtimeDb, `events/${eventId}`);
  await set(eventRef, updatedEvent);
};

export const subscribeToEvents = (
  callback: (events: any[] | null, error?: Error) => void
) => {
  const eventsRef = ref(realtimeDb, "events");
  console.log("Subscribing to events at:", eventsRef.toString());
  const unsubscribe = onValue(
    eventsRef,
    (snapshot) => {
      try {
        const data = snapshot.val();
        if (data && typeof data === "object") {
          const now = Date.now();
          const activeEvents: any[] = [];

          for (const [key, value] of Object.entries(data)) {
            const event = value as any;
            event.id = key;

            if (
              event.isActive === false &&
              event.canceledAt &&
              now - event.canceledAt > 2 * 60 * 60 * 1000 // change this to > 1000 for debug now its 2 hours 
            ) {
              const refToDelete = ref(realtimeDb, `events/${key}`);
              remove(refToDelete);
              continue;
            }

            activeEvents.push(event);
          }

          console.log("Active events:", activeEvents);
          callback(activeEvents);
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

export async function deleteEventById(eventId: string) {
  const eventRef = ref(realtimeDb, `events/${eventId}`);
  await remove(eventRef);
}

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

export const createEvent = async (
  values: Record<string, string>,
  onReset: () => void
): Promise<void> => {
  try {
    const node = push(ref(realtimeDb, "events"));
    const id = node.key;

    await set(node, {
      id,
      ...values,
      isActive: true,
      createdAt: new Date().getTime(),
    });

    onReset();
    return;
  } catch (error: any) {
    throw new Error(
      "Error saving event: " + (error?.message || JSON.stringify(error))
    );
  }
};


export const addVolunteerToEvent = async (
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

export const removeVolunteerFromEvent = async (
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
export const addUserArrivalTime = async (
  eventId: string,
  volunteerId: string,
): Promise<void> => {
  try {
    const eventRef = ref(realtimeDb, `events/${eventId}/volunteers/${volunteerId}/arrivedAt`);
    await set(eventRef, serverTimestamp());
  } catch (error: any) {
    throw new Error(
      'Error adding user arrival time: ' + (error?.message || JSON.stringify(error))
    );
  }
}

export const fetchEvent = async (eventId: string): Promise<Event | null> => {
  try {
    const eventRef = ref(realtimeDb, `events/${eventId}`);
    const snapshot = await get(eventRef);
    if (snapshot.exists()) {
      return snapshot.val() as Event;
    } else {
      return null;
    }
  } catch (error: any) {
    throw new Error(
      'Error fetching event: ' + (error?.message || JSON.stringify(error))
    );
  }
}

export const updateStartEndEvent = async (
    volunteerId: string,
    eventId: string
  ): Promise<void> => {
    try {
      const eventRef = ref(realtimeDb, `events/${eventId}`);
      await update(eventRef, {
        summaryReportFiller: volunteerId,
      });
    } catch (error: any) {
      throw new Error(
        'Error updating start/end event: ' + (error?.message || JSON.stringify(error))
      );
    }
  } 

