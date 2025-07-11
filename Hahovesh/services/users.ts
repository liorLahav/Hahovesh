import {
  deleteDoc,
  DocumentData,
  updateDoc,
  doc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  CollectionReference,
  setDoc,
} from "firebase/firestore";
import { db, app } from "../FirebaseConfig";
import { httpsCallable, getFunctions } from "firebase/functions";
import firestore from '@react-native-firebase/firestore';


// Initialize functions
const functions = getFunctions(app);
type CreateUserResponse = {
  success: boolean,
  conflict: string,
  details: string,
}

// Use Cloud Function for user registration
export async function createUser({ firstName, lastName, identifier, phone }: {
  firstName: string;
  lastName: string;
  identifier: string;
  phone: string;
}): Promise<CreateUserResponse> {
  try {
    const registerUserFunction = httpsCallable(functions, 'registerUser');
    const result = await registerUserFunction({
      firstName,
      lastName,
      identifier,
      phone
    });
    
    return result.data as CreateUserResponse;
  } catch (error: any) {
    console.error("Error calling registerUser function:", error);
    throw new Error(
      "Error registering user: " + (error?.message || JSON.stringify(error))
    );
  }
}

export const deleteUser = async (user_id: string) => {
  try {
    const userRef = firestore().collection('volunteers').doc(user_id);
    await userRef.delete();
  } catch (error: any) {
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
    const userRef = firestore().collection('volunteers').doc(user_id);
    await userRef.update({ permissions: newPermissions });
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error("Error updating permissions: " + error.message);
    } else {
      throw new Error(
        "Unknown error updating permissions: " + JSON.stringify(error)
      );
    }
  }
};

export const updateStatus = async (user_id: string, status: string) => {
  try {
    const userRef = firestore().collection('volunteers').doc(user_id);
    await userRef.update({ status });
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error("Error updating status: " + error.message);
    } else {
      throw new Error("Unknown error updating status: " + JSON.stringify(error));
    }
  }
};

export const getAllUsers = async (): Promise<any[]> => {
  try {
    console.log("Getting all users from Firestore...");

    const snapshot = await firestore()
      .collection('volunteers')
      .get();

    if (snapshot.empty) {
      console.log("No users found in database");
      return [];
    }

    const usersData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    console.log(`Retrieved ${usersData.length} users from Firestore`);
    return usersData;
  } catch (error: any) {
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
    const userRef = firestore().collection('volunteers').doc(userId);
    await userRef.update({ status });
    console.log("Status updated:", status);
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

export const getUserByPhoneNumber = async (phoneNumber: string): Promise<any | null> => {
  try {
    console.log("Fetching user by phone number:", phoneNumber);
    
    const querySnapshot = await firestore()
      .collection('volunteers')
      .where('phone', '==', phoneNumber)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.log("User not found in database");
      return null;
    }

    const doc = querySnapshot.docs[0];
    const userData = doc.data();
    return { ...userData, id: doc.id };
  } catch (error: any) {
    console.error("Error fetching user by phone number:", error);
    throw new Error(
      "Error fetching user: " + (error?.message || JSON.stringify(error))
    );
  }
};


export async function updateExpoToken(userId: string, expoPushToken: string) {
  try {
    const userRef = firestore().collection('volunteers').doc(userId);
    await userRef.update({ expoPushToken });
    console.log("Expo token updated successfully for user:", userId);
  } catch (error: any) {
    console.error("Error updating Expo token:", error);
    throw new Error(
      "Error updating Expo token: " + (error?.message || JSON.stringify(error))
    );
  }
}

export async function removeExpoToken(userId: string) {
  try {
    const userRef = firestore().collection('volunteers').doc(userId);
    await userRef.update({ expoPushToken: null });
    console.log("Expo token removed successfully for user:", userId);
  } catch (error: any) {
    console.error("Error removing Expo token:", error);
    throw new Error(
      "Error removing Expo token: " + (error?.message || JSON.stringify(error))
    );
  }
}
