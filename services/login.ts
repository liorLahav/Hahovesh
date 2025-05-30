import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export async function loginWithPhoneAndId(phone: string, identifier: string) {
  const volunteersRef = collection(db, "volunteers");
  const q = query(
    volunteersRef,
    where("phone", "==", phone),
    where("id", "==", identifier)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { success: false, error: "מספר הטלפון או תעודת הזהות שגויים. אנא נסה שוב." };
  }

  const volunteerData = querySnapshot.docs[0].data();

  if (
    volunteerData.permissions &&
    (volunteerData.permissions.includes("pending") || volunteerData.permissions.includes("Pending"))
  ) {
    return { success: false, error: "חשבונך עדיין בבדיקה וממתין לאישור מנהל. נא לנסות שוב מאוחר יותר." };
  }

  return { success: true, data: volunteerData };
}