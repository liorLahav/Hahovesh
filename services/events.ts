import { realtimeDb } from "@/FirebaseConfig";
import { get, onChildAdded, onValue, ref } from "firebase/database";

type Event = {
  id: string;
  createdAt: string;
  anamnesis: string;
  haznk_code: string;
  house_number: string;
  informat_location: string;
  location_type: string;
  medical_code: string;
  patient_age: string;
  patient_name: string;
  patient_sex: string;
  phone_number1: string;
  phone_number2: string;
  recipient: string;
  urgency: string;
  street: string;
  apartment_details: string;
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
