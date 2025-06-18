import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/FirebaseConfig";
import { 
  PhoneAuthProvider, 
  signInWithCredential, 
  RecaptchaVerifier,
  sendSignInLinkToEmail, 
  signInWithPhoneNumber,
  UserCredential
} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllUsers } from "./users";

export type LoginResult = {
  success: boolean;
  verificationCallback?: (code: string) => Promise<VerificationResult>;
  error?: string;
  data?: any;
};
export type VerificationResult = {
  success: boolean;
  user?: UserCredential;
};

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const sendVerificationCode = async (phoneNumber: string,recaptchaVerifier : any): Promise<LoginResult> => {
  try {
    console.log("Verification code sent to:", phoneNumber);

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );
    return {
      success: true,
      verificationCallback: async (code : string) => {
        try {
          const result : UserCredential = await confirmationResult.confirm(code);
          return {
            success: true,
            user: result,
          };
        }
        catch (error) {
          return {
            success: false,
          }
        }
      }
    };
  } catch (error) {
    console.error("Phone verification error:", error);
    return {
      success: false,
      error: "שגיאה בשליחת קוד האימות. אנא נסה שוב מאוחר יותר."
    };
  }
};

export const loginWithPhoneAndId = async (phone: string, identifier: string): Promise<LoginResult> => {
  try {
    // Format the phone number for consistency
    const formattedPhone = phone;
    console.log("Formatted phone number:", formattedPhone);
    const localPhone = formattedPhone.replace('+972', '0');
    
    const volunteersRef = collection(db, "volunteers");
    const q = query(
      volunteersRef,
      where("phone", "in", [formattedPhone, localPhone, phone]),
      where("id", "==", identifier)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "הפרטים שהוזנו שגויים" };
    }

    const volunteerData = querySnapshot.docs[0].data();

    if (
      volunteerData.permissions &&
      (volunteerData.permissions.includes("pending") || volunteerData.permissions.includes("Pending"))
    ) {
      return { success: false, error: "חשבונך עדיין בבדיקה וממתין לאישור מנהל. נא לנסות שוב מאוחר יותר." };
    }

    return { 
      success: true, 
      data: {
        ...volunteerData,
        id: querySnapshot.docs[0].id
      }
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "אירעה שגיאה בהתחברות. אנא נסה שוב." };
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await auth.signOut();
    console.log("User signed out successfully");
    await AsyncStorage.removeItem('user');
    
  } catch (error: unknown) {
    console.error("Error signing out:", error);
    const message = error instanceof Error ? error.message : String(JSON.stringify(error));
    throw new Error(message);
  }
}