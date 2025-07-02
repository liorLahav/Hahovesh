import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

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
  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  return (
    <>
      <View style={tw`mb-4 w-full`}>
        <Text style={tw`text-blue-900 mb-1 text-right font-semibold`}>מספר טלפון</Text>
        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg text-right`}
          placeholder="הכנס את מספר הטלפון שלך"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          textAlign="right"
          maxLength={10}
        />
      </View>

      <View style={tw`mb-4 w-full`}>
        <Text style={tw`text-blue-900 mb-1 text-right font-semibold`}>מספר תעודת זהות</Text>
        <TextInput
          style={tw`bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg text-right`}
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
        style={tw`bg-blue-700 rounded-lg w-full py-3 mt-2 shadow-md items-center ${isLoading || loginStatus !== '' ? 'opacity-50' : 'opacity-100'}`}
        onPress={handleLogin}
        disabled={isLoading || loginStatus !== ''}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white font-semibold text-lg`}>שלח קוד אימות</Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default LoginForm;
