import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { firebaseConfig } from "@/FirebaseConfig";

interface PhoneVerificationProps {
  phoneNumber: string;
  onCodeSubmit: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  error?: string;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  phoneNumber,
  onCodeSubmit,
  onResendCode,
  onCancel,
  isLoading,
  error,
}) => {
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRef = useRef<TextInput>(null);
  const [codeBoxes, setCodeBoxes] = useState<Array<string>>(Array(6).fill(""));

  // Auto-focus the input field
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format phone number for display
  const formatPhone = (phone: string) => {
    if (!phone) return "";
    
    // Format Israeli phone number (e.g., 05X-XXX-XXXX)
    if (phone.startsWith("+972")) {
      const national = phone.replace("+972", "0");
      if (national.length === 10) {
        return `${national.substring(0, 3)}-${national.substring(3, 6)}-${national.substring(6)}`;
      }
    } else if (phone.startsWith("0") && phone.length === 10) {
      return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6)}`;
    }
    
    return phone;
  };

  // Handle code input
  const handleCodeChange = (text: string) => {
    // Only allow numbers and maximum 6 digits
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 6) {
      setCode(numericValue);
      
      // Update the code boxes
      const newCodeBoxes = [...codeBoxes];
      for (let i = 0; i < 6; i++) {
        newCodeBoxes[i] = numericValue[i] || "";
      }
      setCodeBoxes(newCodeBoxes);
    }
  };

  // Handle code submission
  const handleSubmit = async () => {
    if (code.length !== 6 || isLoading) return;
    await onCodeSubmit(code);
  };
  const recaptchaVerifier = useRef(null);
  
  return (
    <SafeAreaView className="flex-1 bg-blue-200">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        <View className="bg-white p-6 rounded-2xl shadow-md">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="smartphone" size={32} color="#3b82f6" />
            </View>
            <Text className="text-2xl font-bold text-blue-800 mb-2 text-center">אימות מספר טלפון</Text>
            <Text className="text-base text-gray-600 text-center">
              קוד אימות נשלח למספר
            </Text>
            <Text className="text-lg font-semibold text-blue-700 mt-1">
              {formatPhone(phoneNumber)}
            </Text>
          </View>

          {/* Error message */}
          {error ? (
            <View className="bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
              <Text className="text-red-700 text-base text-center">{error}</Text>
            </View>
          ) : null}

          <Text className="text-center text-gray-600 mb-2">הזן את קוד האימות בן 6 הספרות</Text>

          <View className="w-full mb-6">
            {/* Hidden input that captures all keystrokes */}
            <TextInput
              ref={inputRef}
              className="absolute opacity-0"
              keyboardType="number-pad"
              value={code}
              onChangeText={handleCodeChange}
              maxLength={6}
            />

            {/* Visual code boxes */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-full items-center my-4"
              onPress={() => inputRef.current?.focus()}
            >
              <View className="flex-row justify-center">
                {codeBoxes.map((digit, index) => (
                  <View
                    key={index}
                    className={`w-12 h-14 border-2 rounded-lg mx-1 items-center justify-center
                      ${digit ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <Text className="text-xl font-bold">
                      {digit}
                    </Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            <Text className="text-blue-600 text-center mt-1 mb-4">לחץ להזנת הקוד</Text>
          </View>

          {/* Submit button */}
          <TouchableOpacity
            className={`bg-blue-700 rounded-lg w-full py-3 shadow-md items-center ${
              isLoading || code.length !== 6 ? "opacity-50" : ""
            }`}
            onPress={handleSubmit}
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-semibold text-lg">אימות</Text>
            )}
          </TouchableOpacity>

          {/* Action buttons */}
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity 
              className="py-2 px-4" 
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text className="text-blue-700 font-semibold">חזרה</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`py-2 px-4 ${timeLeft > 0 ? "opacity-50" : ""}`}
              onPress={() => {
                if (timeLeft > 0 || isLoading) return;
                setTimeLeft(60);
                onResendCode();
              }}
              disabled={timeLeft > 0 || isLoading}
            >
              <Text className={`${timeLeft > 0 ? "text-gray-500" : "text-blue-700"} font-medium`}>
                {timeLeft > 0 ? `שלח קוד חדש (${timeLeft})` : "שלח קוד חדש"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneVerification;