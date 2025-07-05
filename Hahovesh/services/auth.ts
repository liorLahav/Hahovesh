import { app } from "@/FirebaseConfig";
import { 
  UserCredential
} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import auth from '@react-native-firebase/auth';


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


export const sendVerificationCode = async (phoneNumber: string): Promise<LoginResult> => {
  try {
    console.log("Verification code sent to:", phoneNumber);

    const confirmationResult = await await auth().signInWithPhoneNumber(phoneNumber);
    return {
      success: true,
      verificationCallback: async (code : string) => {
        try {
          
          const result : any = await confirmationResult.confirm(code);
          if (!result || !result.user) {
            return {
              success: false,
              error: "Invalid verification code or user not found."
            };
          }
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
    // Use auth() for @react-native-firebase/auth
    await auth().signOut();
    console.log("User signed out successfully");
    await AsyncStorage.removeItem('user');
  } catch (error: unknown) {
    console.error("Error signing out:", error);
    const message = error instanceof Error ? error.message : String(JSON.stringify(error));
    throw new Error(message);
  }
}