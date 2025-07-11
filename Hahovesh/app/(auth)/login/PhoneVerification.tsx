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

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    if (phone.startsWith("+972")) {
      const national = phone.replace("+972", "0");
      if (national.length === 10) {
        return `${national.slice(0,3)}-${national.slice(3,6)}-${national.slice(6)}`;
      }
    } else if (phone.startsWith("0") && phone.length === 10) {
      return `${phone.slice(0,3)}-${phone.slice(3,6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleCodeChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    if (numeric.length <= 6) {
      setCode(numeric);
      const boxes = Array(6).fill("");
      for (let i = 0; i < numeric.length; i++) boxes[i] = numeric[i];
      setCodeBoxes(boxes);
    }
  };

  const handleSubmit = async () => {
    if (code.length === 6 && !isLoading) await onCodeSubmit(code);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-200 justify-center`}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 items-center justify-center px-4`}
      >
        <View style={tw`bg-white p-4 rounded-2xl shadow-md w-11/12 mx-auto`}>
          <View style={tw`items-center mb-4`}>
            <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3`}>
              <MaterialIcons name="smartphone" size={28} color="#3b82f6" />
            </View>
            <Text style={tw`text-xl font-bold text-blue-800 mb-1 text-center`}>אימות מספר טלפון</Text>
            <Text style={tw`text-base text-gray-600 text-center`}>קוד אימות נשלח למספר</Text>
            <Text style={tw`text-base font-semibold text-blue-700 mt-1`}>{formatPhone(phoneNumber)}</Text>
          </View>

          {error && (
            <View style={tw`bg-red-100 border border-red-400 rounded-lg p-2 mb-3`}>
              <Text style={tw`text-red-700 text-sm text-center`}>{error}</Text>
            </View>
          )}

          <Text style={tw`text-center text-gray-600 mb-1`}>הזן קוד אימות בן 6 ספרות</Text>

          <View style={tw`w-full mb-4`}>
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
              onPress={() => inputRef.current?.focus()}
              style={tw`w-full items-center my-2`}
            >
              <View style={tw`flex-row justify-center`}>  
                {codeBoxes.map((digit, i) => (
                  <View
                    key={i}
                    style={tw`${digit ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} w-10 h-12 border-2 rounded-lg mx-1 items-center justify-center`}
                  >
                    <Text style={tw`text-lg font-bold`}>{digit}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>

            <Text style={tw`text-blue-600 text-center mb-3`}>לחץ להזנת הקוד</Text>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || code.length !== 6}
            style={tw`bg-blue-700 rounded-lg w-full py-2 items-center ${isLoading || code.length !== 6 ? 'opacity-50' : 'opacity-100'}`}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={tw`text-white font-semibold text-base`}>אימות</Text>
            )}
          </TouchableOpacity>

          <View style={tw`flex-row justify-between mt-4`}>  
            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              style={tw`py-1 px-3`}
            >
              <Text style={tw`text-blue-700 font-semibold`}>חזרה</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (timeLeft > 0 || isLoading) return;
                setTimeLeft(60);
                onResendCode();
              }}
              disabled={timeLeft > 0 || isLoading}
              style={tw`py-1 px-3 ${timeLeft > 0 ? 'opacity-50' : 'opacity-100'}`}
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
