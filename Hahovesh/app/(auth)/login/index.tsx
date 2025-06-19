import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Alert, SafeAreaView, Text, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { UserContext, useUserContext } from "../../../hooks/UserContext";
import { loginWithPhoneAndId, sendVerificationCode } from "../../../services/auth";
import LoginForm from "./LoginForm";
import StatusMessage from "./StatusMessage";
import LoginFooter from "./LoginFooter";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from "@/FirebaseConfig";
import PhoneVerification from "./PhoneVerification";
import {auth} from "@/FirebaseConfig";


const Login = () => {
  const recaptchaVerifier = useRef(null);
  // State for form fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for verification
  const [showVerification, setShowVerification] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  // State for status messages
  const [loginStatus, setLoginStatus] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [loginError, setLoginError] = useState("");


  const verifyUserRef = useRef<((code: string) => Promise<any>) | null>(null);

  // Get user context
  const {changeUser} = useUserContext();
  
  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('0')) {
      return '+972' + cleaned.substring(1);
    } else if (!cleaned.startsWith('+')) {
      return '+972' + cleaned;
    }
    
    return cleaned;
  };

  // Handle initial login and send verification code
  const handleLogin = async () => {
    // Validate inputs
    if (!phoneNumber || !identifier) {
      Alert.alert("שדות חסרים", "אנא מלא את כל הפרטים");
      return;
    }
    console.log("Phone number:", phoneNumber, "Identifier:", identifier);
    if (phoneNumber.length < 10) {
      Alert.alert("שגיאה", "מספר טלפון לא תקין");
      return;
    }

    if (identifier.length < 9) {
      Alert.alert("שגיאה", "מספר תעודת זהות לא תקין");
      return;
    }

    // Reset status
    setLoginStatus("");
    setWelcomeName("");
    setLoginError("");
    setIsLoading(true);
    setVerificationError("");
    console.log("Attempting login with phone:", formatPhoneNumber(phoneNumber), "and ID:", identifier);
    try {
      const loginResult = await loginWithPhoneAndId(formatPhoneNumber(phoneNumber), identifier);
      if (!loginResult.success) {
        setLoginError(loginResult.error || "שגיאה בהתחברות. אנא נסה שוב.");
        setIsLoading(false);
        return;
      }
      const formattedPhone = formatPhoneNumber(phoneNumber);

      // Send verification code
      const verificationResult = await sendVerificationCode(formattedPhone,recaptchaVerifier.current);

      if (!verificationResult.success) {
        setLoginError(verificationResult.error || "שגיאה בשליחת קוד האימות");
        setIsLoading(false);
        return;
      }
      verifyUserRef.current = verificationResult.verificationCallback || null;

      setIsLoading(false);
      setShowVerification(true);
    } catch (err) {
      console.error("שגיאת התחברות:", err);
      setLoginError("משהו השתבש במהלך ההתחברות. אנא נסה שוב.");
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (code: string) => {
    setIsLoading(true);
    setVerificationError("");

    try {
      // Verify the code
      if (!verifyUserRef.current) {
        throw new Error("No verification callback available");
      }
      
      const result = await verifyUserRef.current(code);
      console.log("Verification result:", result);

      if (!result.success) {
        setVerificationError(result.error || "קוד אימות שגוי");
        setIsLoading(false);
        return;
      }

      // Get user data
      console.log("User data:", result);
      console.log()
      const userData = result.user;
      console.log("User data:", userData);
      changeUser(userData.user.phoneNumber);

      // Show success message
      setLoginStatus("התחברות הצליחה!");
      setWelcomeName(userData.first_name);
      // Navigate to home after a short delay
      router.replace('/home');
      setIsLoading(false);
    } catch (err) {
      console.error("שגיאת אימות:", err);
      setVerificationError("שגיאה באימות הקוד. אנא נסה שוב.");
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResendCode = async () => {
    setIsLoading(true);
    setVerificationError("");

    try {
      const result = await sendVerificationCode(phoneNumber, recaptchaVerifier.current);

      if (!result.success) {
        setVerificationError(result.error || "שגיאה בשליחת קוד האימות");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      Alert.alert("קוד נשלח", "קוד אימות חדש נשלח למכשיר שלך");
    } catch (err) {
      console.error("שגיאה בשליחה חוזרת:", err);
      setVerificationError("שגיאה בשליחת קוד האימות. אנא נסה שוב.");
      setIsLoading(false);
    }
  };

  // Show verification screen if needed
  if (showVerification) {
    return (
      <PhoneVerification
        phoneNumber={phoneNumber}
        onCodeSubmit={handleVerifyCode}
        onResendCode={handleResendCode}
        onCancel={() => setShowVerification(false)}
        isLoading={isLoading}
        error={verificationError}
      />
    );
  }

  // Main login screen
  return (
    <SafeAreaView className="flex-1 bg-blue-200">
      {auth && (
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig} // עדיף להשתמש בזה!
          attemptInvisibleVerification={true}
        />
      )}

      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 items-center justify-center px-4"
      >
        <View className="w-full max-w-xl items-center">
          <Text className="text-3xl font-bold text-blue-800 mb-2 text-center">התחברות</Text>
          <Text className="text-lg text-blue-700 mb-8 text-center">התחבר למשתמש שלך</Text>
          
          <StatusMessage 
            loginStatus={loginStatus}
            welcomeName={welcomeName}
            loginError={loginError}
          />
          
          <LoginForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            identifier={identifier}
            setIdentifier={setIdentifier}
            handleLogin={handleLogin}
            isLoading={isLoading}
            loginStatus={loginStatus}
            loginError={loginError}
          />
          
          <LoginFooter />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Login;