import database from '@react-native-firebase/database';

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
  await database().ref(`events/${eventId}`).remove();
};

export const updateEvent = async (eventId: string, updatedEvent: Event) => {
  await database().ref(`events/${eventId}`).set(updatedEvent);
};

export const subscribeToEvents = (
  callback: (events: any[] | null, error?: Error) => void
) => {
  const eventsRef = database().ref("events");
  console.log("Subscribing to events at:", eventsRef.toString());

  const listener = eventsRef.on('value', (snapshot) => {
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
            now - event.canceledAt > 2 * 60 * 60 * 1000
          ) {
            database().ref(`events/${key}`).remove();
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
  }, (error) => {
    callback(null, error);
  });

  return () => eventsRef.off('value', listener);
};

export async function deleteEventById(eventId: string) {
  await database().ref(`events/${eventId}`).remove();
}

export const subscribeToEventsById = (
  id: string,
  callback: (event: Event | null, error?: Error) => void
) => {
  const eventRef = database().ref(`events/${id}`);
  const listener = eventRef.on('value', (snapshot) => {
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
  }, (error) => {
    callback(null, error);
  });

  return () => eventRef.off('value', listener);
};

export const createEvent = async (
  values: Record<string, string>,
  onReset: () => void
): Promise<void> => {
  const node = database().ref("events").push();
  const id = node.key;

  await node.set({
    id,
    ...values,
    isActive: true,
    createdAt: new Date().getTime(),
  });

  onReset();
};

export const addVolunteerToEvent = async (
  eventId: string,
  volunteerId: string
): Promise<void> => {
  await database()
    .ref(`events/${eventId}/volunteers/${volunteerId}`)
    .set({ volunteerId, joinedAt: database.ServerValue.TIMESTAMP });
};

export const removeVolunteerFromEvent = async (
  eventId: string,
  volunteerId: string
): Promise<void> => {
  await database()
    .ref(`events/${eventId}/volunteers/${volunteerId}`)
    .remove();
};

export const addUserArrivalTime = async (
  eventId: string,
  volunteerId: string,
): Promise<void> => {
  await database()
    .ref(`events/${eventId}/volunteers/${volunteerId}/arrivedAt`)
    .set(database.ServerValue.TIMESTAMP);
};

export const fetchEvent = async (eventId: string): Promise<Event | null> => {
  const snapshot = await database().ref(`events/${eventId}`).once('value');
  return snapshot.exists() ? (snapshot.val() as Event) : null;
};

export const updateStartEndEvent = async (
  volunteerId: string,
  eventId: string
): Promise<void> => {
  await database()
    .ref(`events/${eventId}`)
    .update({ summaryReportFiller: volunteerId });
};
