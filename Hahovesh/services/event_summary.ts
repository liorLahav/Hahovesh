import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/FirebaseConfig';

/* טיפוס בסיסי לדוח */
export interface EventSummary {
  id: string;
  createdAt?: Timestamp;
  title?: string;
  [key: string]: any;
}

/* ────────────────── CRUD ────────────────── */

/** יצירת דוח חדש */
export const saveEventSummary = async (
  data: Omit<EventSummary, 'id'>,
): Promise<string> => {
  const ref = await addDoc(collection(db, 'eventSummaries'), data);
  return ref.id;
};

/** עדכון מאפיינים חלקי */
export const updateEventSummary = async (
  id: string,
  data: Partial<EventSummary>,
) => updateDoc(doc(db, 'eventSummaries', id), data);

/** שליפת דוח יחיד (פעם אחת) */
export const getEventSummary = async (
  id: string,
): Promise<EventSummary | null> => {
  const snap = await getDoc(doc(db, 'eventSummaries', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as EventSummary) : null;
};

export const subscribeEventSummary = (
  id: string,
  cb: (d: EventSummary | null) => void,
) =>
  onSnapshot(doc(db, 'eventSummaries', id), (snap) =>
    cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as EventSummary) : null),
  );

export const fetchEventSummaries = async (): Promise<EventSummary[]> => {
  const col = collection(db, 'eventSummaries');
  try {
    const ordered = await getDocs(query(col, orderBy('createdAt', 'desc')));
    if (!ordered.empty)
      return ordered.docs.map(
        (d) => ({ id: d.id, ...d.data() } as EventSummary),
      );
  } catch {
  }
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventSummary));
};
