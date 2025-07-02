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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "@/FirebaseConfig";
import tw from "twrnc";

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
  const [codeBoxes, setCodeBoxes] = useState<string[]>(Array(6).fill(""));
  const recaptchaVerifier = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatPhone = (phone: string) => {
    if (!phone) return "";
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

  const handleCodeChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue.length <= 6) {
      setCode(numericValue);
      const newCodeBoxes = [...codeBoxes];
      for (let i = 0; i < 6; i++) {
        newCodeBoxes[i] = numericValue[i] || "";
      }
      setCodeBoxes(newCodeBoxes);
    }
  };

  const handleSubmit = async () => {
    if (code.length !== 6 || isLoading) return;
    await onCodeSubmit(code);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-200`}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 justify-center px-6`}
      >
        <View style={tw`bg-white p-6 rounded-2xl shadow-md`}>  
          <View style={tw`items-center mb-6`}>
            <View style={tw`w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4`}>
              <MaterialIcons name="smartphone" size={32} color="#3b82f6" />
            </View>
            <Text style={tw`text-2xl font-bold text-blue-800 mb-2 text-center`}>אימות מספר טלפון</Text>
            <Text style={tw`text-base text-gray-600 text-center`}>קוד אימות נשלח למספר</Text>
            <Text style={tw`text-lg font-semibold text-blue-700 mt-1`}>{formatPhone(phoneNumber)}</Text>
          </View>

          {error ? (
            <View style={tw`bg-red-100 border border-red-400 rounded-lg p-3 mb-4`}>  
              <Text style={tw`text-red-700 text-base text-center`}>{error}</Text>
            </View>
          ) : null}

          <Text style={tw`text-center text-gray-600 mb-2`}>הזן את קוד האימות בן 6 הספרות</Text>

          <View style={tw`w-full mb-6`}>
            <TextInput
              ref={inputRef}
              style={tw`absolute opacity-0`}
              keyboardType="number-pad"
              value={code}
              onChangeText={handleCodeChange}
              maxLength={6}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              style={tw`w-full items-center my-4`}
              onPress={() => inputRef.current?.focus()}
            >
              <View style={tw`flex-row justify-center`}>  
                {codeBoxes.map((digit, index) => (
                  <View
                    key={index}
                    style={tw`${digit ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} w-12 h-14 border-2 rounded-lg mx-1 items-center justify-center`}
                  >
                    <Text style={tw`text-xl font-bold`}>{digit}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            <Text style={tw`text-blue-600 text-center mt-1 mb-4`}>לחץ להזנת הקוד</Text>
          </View>

          <TouchableOpacity
            style={tw`bg-blue-700 rounded-lg w-full py-3 shadow-md items-center ${isLoading || code.length !== 6 ? 'opacity-50' : 'opacity-100'}`}
            onPress={handleSubmit}
            disabled={isLoading || code.length !== 6}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={tw`text-white font-semibold text-lg`}>אימות</Text>
            )}
          </TouchableOpacity>

          <View style={tw`flex-row justify-between mt-6`}>
            <TouchableOpacity
              style={tw`py-2 px-4`}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={tw`text-blue-700 font-semibold`}>חזרה</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`py-2 px-4 ${timeLeft > 0 ? 'opacity-50' : 'opacity-100'}`}
              onPress={() => {
                if (timeLeft > 0 || isLoading) return;
                setTimeLeft(60);
                onResendCode();
              }}
              disabled={timeLeft > 0 || isLoading}
            >
              <Text style={tw`${timeLeft > 0 ? 'text-gray-500' : 'text-blue-700'} font-medium`}>
                {timeLeft > 0 ? `שלח קוד חדש (${timeLeft})` : 'שלח קוד חדש'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PhoneVerification;
