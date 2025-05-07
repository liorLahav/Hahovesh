import { doc, updateDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const userRef = doc(db, "volunteers", userId);
    await updateDoc(userRef, { status: status });
    console.log("Status :", status);
  } catch (error) {
    console.error("Error updating status: ", error);
  }
};
