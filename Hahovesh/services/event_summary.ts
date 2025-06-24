import { db, realtimeDb } from '@/FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, get ,remove } from 'firebase/database';


export const saveEventSummary = async (data: Record<string, any>) => {
  try {
    const docRef = await addDoc(collection(db, 'eventSummaries'), data);
    console.log('✅ דוח נשמר:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ שגיאה בשמירה:', error);
    throw error;
  }
};





