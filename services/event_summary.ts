import { db, realtimeDb } from '@/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, get ,remove } from 'firebase/database';


export const saveEventSummary = async (data: Record<string, string>) => {
  try {
    const docRef = await addDoc(collection(db, 'eventSummaries'), data);
    console.log('✅ דוח נשמר:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ שגיאה בשמירה:', error);
    throw error;
  }
};




export const loadInitialValuesFromRealtime = async (
  eventId: string
): Promise<{ initialValues: Record<string, string>, extraFields: Record<string, string> }> => {
  try {
    const nodeRef = ref(realtimeDb, `events/${eventId}`);
    const snapshot = await get(nodeRef);

    if (snapshot.exists()) {
      const data = snapshot.val();

    
      const mappedFields: Record<string, string> = {
        name: data.patient_name ?? '',
        gender: data.patient_sex ?? '',
        event_address: data.street ?? '',
        medical_code: data.medical_code ?? '',
        receiver: data.recipient ?? '',
        event_location: data.informant_location ?? ''
      };

      
      await remove(nodeRef);

      return {
        initialValues: mappedFields,
        extraFields: {} 
      };
    } else {
      return { initialValues: {}, extraFields: {} };
    }
  } catch (err) {
    console.error(' error - DB:', err);
    return { initialValues: {}, extraFields: {} };
  }
};
