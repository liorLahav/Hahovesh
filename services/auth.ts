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

// For web implementations - mobile uses the native reCAPTCHA
let recaptchaVerifier: RecaptchaVerifier | null = null;


/**
 * Send verification code to the phone number
 */
export const sendVerificationCode = async (phoneNumber: string,recaptchaVerifier : any): Promise<LoginResult> => {
  try {
    console.log("📱 Verification code sent to:", phoneNumber);

    // Request verification code
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      "+13322767084",
      recaptchaVerifier
    );
    console.log("📱 Verification code sent to:", phoneNumber);
    console.log(confirmationResult.verificationId);
    return {
      success: true,
      verificationCallback: async (code : string) => {
        try {
          const result : UserCredential = await confirmationResult.confirm(code);
          console.log("✅ Verification code confirmed:", result);
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
    const localPhone = formattedPhone.replace('+972', '0');
    
    const volunteersRef = collection(db, "volunteers");
    // Query for phone number in different formats
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