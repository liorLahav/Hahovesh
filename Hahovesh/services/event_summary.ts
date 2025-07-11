import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/* טיפוס בסיסי לדוח */
export interface EventSummary {
  id: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp;
  title?: string;
  [key: string]: any;
}

/** יצירת דוח חדש */
export const saveEventSummary = async (
  data: Omit<EventSummary, "id">
): Promise<string> => {
  const ref = await firestore().collection("eventSummaries").add(data);
  return ref.id;
};

/** עדכון מאפיינים חלקי */
export const updateEventSummary = async (
  id: string,
  data: Partial<EventSummary>
) => {
  await firestore().collection("eventSummaries").doc(id).update(data);
};

/** שליפת דוח יחיד (פעם אחת) */
export const getEventSummary = async (
  id: string
): Promise<EventSummary | null> => {
  const snap = await firestore().collection("eventSummaries").doc(id).get();
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as EventSummary) : null;
};

export const subscribeEventSummary = (
  id: string,
  cb: (d: EventSummary | null) => void
) =>
  firestore()
    .collection("eventSummaries")
    .doc(id)
    .onSnapshot((snap) => {
      cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as EventSummary) : null);
    });

export const fetchEventSummaries = async (): Promise<EventSummary[]> => {
  const col = firestore().collection("eventSummaries");
  try {
    const ordered = await col.orderBy("createdAt", "desc").get();
    if (!ordered.empty)
      return ordered.docs.map(
        (d) => ({ id: d.id, ...d.data() } as EventSummary)
      );
  } catch {}
  // fallback if orderBy failed
  const snap = await col.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventSummary));
};
