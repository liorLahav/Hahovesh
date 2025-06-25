import { db, realtimeDb } from '@/FirebaseConfig';
import { collection, doc, addDoc, getDocs, orderBy, updateDoc, query ,Timestamp, DocumentData } from 'firebase/firestore';
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

export const updateEventSummary = async (
  id: string,
  data: Partial<EventSummary>,
) => {
  await updateDoc(doc(db, 'eventSummaries', id), data);
};
export interface EventSummary {
  id: string;
  createdAt?: Timestamp;
  title?: string;
  [key: string]: any;
}

export const fetchEventSummaries = async (): Promise<EventSummary[]> => {
  const colRef = collection(db, 'eventSummaries');

  try {
    const snapOrdered = await getDocs(query(colRef, orderBy('createdAt', 'desc')));
    if (!snapOrdered.empty) {
      return snapOrdered.docs.map<EventSummary>((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as EventSummary);
    }
  } catch (err) {
    console.warn('⚠️ fetchEventSummaries: orderBy failed – ייתכן שאין createdAt', err);
  }

  const snap = await getDocs(colRef);
  return snap.docs.map<EventSummary>((doc) => ({
    id: doc.id,
    ...doc.data(),
  }) as EventSummary);
};





