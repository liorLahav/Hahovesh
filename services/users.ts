import { deleteDoc, DocumentData, Firestore, updateDoc, doc, collection, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export const deleteUser = async (user_id : string) => {
    try {
        const userRef = doc(db, "volunteers", user_id);
        await deleteDoc(userRef);
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Error deleting user: " + error.message);
        }
        else {
            throw new Error("Unknown error deleting user: " + JSON.stringify(error));
        }
    }
}
export const updatePermissions = async (user_id: string, newPermissions: string[]) => {
    try {
        const userRef = doc(db, "volunteers", user_id);
        await updateDoc(userRef, { permissions: newPermissions });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Error updating permissions: " + error.message);
        }
        else {
            throw new Error("Unknown error updating permissions: " + JSON.stringify(error));
        }
    }
}
export const getAllUsers = async () : Promise<DocumentData[]>  => {
    try {
        const usersRef = collection(db, "volunteers");
        const snapshot = await getDocs(usersRef);
        const usersData = snapshot.docs.map(doc => doc.data());
        return usersData;
    }
    catch (error : unknown) {
        if (error instanceof Error) {
            throw new Error("Error fetching users: " + error.message);
        }
        else {
            throw new Error("Unknown error fetching users: " + JSON.stringify(error));
        } 
    }
}
