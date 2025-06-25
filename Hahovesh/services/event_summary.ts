import { db, realtimeDb } from '@/FirebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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


export const getEventSummaries = async (): Promise<Record<string, any>[]> => {
  try {
    const summariesCol = collection(db, 'eventSummaries');
    const snap = await getDocs(summariesCol);
    const summaries: Record<string, any>[] = [];
    
    snap.forEach(docSnap => {
      summaries.push({ id: docSnap.id, ...docSnap.data() });
    });
    
    return summaries;
  } catch (error) {
    console.error('❌ שגיאה בקבלת דוחות:', error);
    throw error;
  }
}


