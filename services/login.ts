import { collection, query, where, getDocs } from "firebase/firestore";
import { db,auth } from "../FirebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { User } from "@/hooks/UserContext";

export async function loginWithPhoneAndId(phone: string, identifier: string) {
  const volunteersRef = collection(db, "volunteers");
  const q = query(
    volunteersRef,
    where("phone", "==", phone),
    where("id", "==", identifier)
  );

  const querySnapshot = await getDocs(q);
  console.log("Query snapshot:", querySnapshot);

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

export const checkAuthState = (): Promise<null | any> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); 
      resolve(user as any | null);
    });
  });
};
