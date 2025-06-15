import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface LoginFormProps {
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
  identifier: string;
  setIdentifier: (text: string) => void;
  handleLogin: () => void;
  isLoading: boolean;
  loginStatus: string;
  loginError: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  identifier,
  setIdentifier,
  handleLogin,
  isLoading,
  loginStatus,
  loginError
}) => {
  // Format phone number as user types
  const handlePhoneChange = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  return (
    <>
      <View className="mb-4 w-full">
        <Text className="text-blue-900 mb-1 text-right font-semibold">מספר טלפון</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg text-right"
          placeholder="הכנס את מספר הטלפון שלך"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          textAlign="right"
          maxLength={10}
        />
      </View>

      <View className="mb-4 w-full">
        <Text className="text-blue-900 mb-1 text-right font-semibold">מספר תעודת זהות</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg text-right"
          placeholder="הכנס את תעודת הזהות שלך"
          placeholderTextColor="#888"
          value={identifier}
          onChangeText={setIdentifier}
          textAlign="right"
          secureTextEntry
          keyboardType="number-pad"
          maxLength={9}
        />
      </View>

      <TouchableOpacity
        className={`bg-blue-700 rounded-lg w-full py-3 mt-2 shadow-md items-center ${
          isLoading || loginStatus !== "" ? "opacity-50" : ""
        }`}
        onPress={handleLogin}
        disabled={isLoading || loginStatus !== ""}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">שלח קוד אימות</Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default LoginForm;