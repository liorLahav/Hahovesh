import {
  deleteDoc,
  DocumentData,
  updateDoc,
  doc,
  collection,
  getDocs,
  getDoc,
  CollectionReference,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";

export const deleteUser = async (user_id: string) => {
  try {
    const userRef = doc(db, "volunteers", user_id);
    await deleteDoc(userRef);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error deleting user: " + error.message);
    } else {
      throw new Error("Unknown error deleting user: " + JSON.stringify(error));
    }
  }
};

export const updatePermissions = async (
  user_id: string,
  newPermissions: string[]
) => {
  try {
    const userRef = doc(db, "volunteers", user_id);
    await updateDoc(userRef, { permissions: newPermissions });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error updating permissions: " + error.message);
    } else {
      throw new Error(
        "Unknown error updating permissions: " + JSON.stringify(error)
      );
    }
  }
};

export const updateStatus = async(user_id: string, status: string) => {
  try {
    const userRef = doc(db, "volunteers", user_id);
    await updateDoc(userRef, { status });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error updating status: " + error.message);
    } else {
      throw new Error("Unknown error updating status: " + JSON.stringify(error));
    }
  }
}

export const getAllUsers = async (): Promise<DocumentData[]> => {
  try {
    console.log("Getting all users from Firestore...");
    const usersRef = collection(db, "volunteers");
    const snapshot = await getDocs(usersRef);

    if (snapshot.empty) {
      console.log("No users found in database");
      return [];
    }

    // Get both the data and the ID
    const usersData = snapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        id: doc.id, // Make sure ID is included
      };
    });

    console.log(`Retrieved ${usersData.length} users from Firestore`);
    return usersData;
  } catch (error: unknown) {
    console.error("Error in getAllUsers:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching users: " + error.message);
    } else {
      throw new Error("Unknown error fetching users: " + JSON.stringify(error));
    }
  }
};

export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const userRef = doc(db, "volunteers", userId);
    await updateDoc(userRef, { status });
    console.log("Status:", status);
  } catch (error: any) {
    throw new Error(
      "Error updating status: " + (error?.message || JSON.stringify(error))
    );
  }
};

export const getRoles = async (userId: string): Promise<string[]> => {
  try {
    const docRef = doc(db, "volunteers", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("User not found in database");
    }

    const userData = docSnap.data();
    
    return Array.isArray(userData.permissions) ? userData.permissions : [];
  } catch (error: any) {
    throw new Error(
      "Error fetching roles: " + (error?.message || JSON.stringify(error))
    );
  }
};
export async function registerVolunteer({ firstName, lastName, identifier, phone }: {
  firstName: string;
  lastName: string;
  identifier: string;
  phone: string;
}) {
  // id check
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

  // phone check
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