import { realtimeDb } from "@/FirebaseConfig";
import { get, onChildAdded, onValue, ref } from "firebase/database";

type Event = {
  id: string;
  createdAt: string;
  anamnesis: string;
  apartment: string; 
  haznkCode: string;
  houseNumber: string;
  informatLocation: string;
  location: string;
  medicalCode: string;
  patientAge: string;
  patientName: string;
  patientSex: string;
  phone1: string;
  phone2: string;
  recipient: string;
  urgencyType: string;
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
          for (const [key, value] of Object.entries(data)) {
            (value as any)['id'] = key;
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

export { Event, subscribeToEvents };
