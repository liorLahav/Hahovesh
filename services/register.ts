import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export async function registerVolunteer({ firstName, lastName, identifier, phone }: {
  firstName: string;
  lastName: string;
  identifier: string;
  phone: string;
}) {
  // בדיקת תעודת זהות קיימת
  const idDocRef = doc(db, "volunteers", identifier);
  const idDocSnap = await getDoc(idDocRef);

  if (idDocSnap.exists()) {
    const existingData = idDocSnap.data();
    return {
      success: false,
      conflict: "id",
      details: existingData
    };
  }

  // בדיקת טלפון קיים
  const volunteersRef = collection(db, "volunteers");
  const phoneQuery = query(volunteersRef, where("phone", "==", phone));
  const phoneQuerySnapshot = await getDocs(phoneQuery);

  if (!phoneQuerySnapshot.empty) {
    const existingData = phoneQuerySnapshot.docs[0].data();
    return {
      success: false,
      conflict: "phone",
      details: existingData
    };
  }

  // יצירת משתמש חדש
  await setDoc(doc(db, "volunteers", identifier), {
    first_name: firstName,
    last_name: lastName,
    id: identifier,
    phone: phone,
    permissions: ["pending"],
  });

  return { success: true };
}