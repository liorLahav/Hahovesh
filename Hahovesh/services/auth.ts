import { collection, query, where, getDocs } from "firebase/firestore";
import { app, auth, db } from "@/FirebaseConfig";
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
import { getFunctions, httpsCallable } from "firebase/functions";

type ValidateResponse = {
  valid: boolean;
  error?: string;
};

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

export async function loginWithPhoneAndId(phone: string, identifier: string): Promise<LoginResult> {
  const functions = getFunctions(app);
  console.log("Attempting login with phone:", phone, "and ID:", identifier);
  const validateUser = httpsCallable<{ phoneNumber: string, id: string }, ValidateResponse>(functions, 'validateUser');
  
  try {
    const result = await validateUser({ phoneNumber: phone, id: identifier });
    const data = result.data;
    console.log("Validation result:", data);
    
    if (data.valid) {
      return { success: true };
    } else {
      return { success: false, error: data.error || "Invalid credentials" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Authentication failed. Please try again." };
  }
}

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