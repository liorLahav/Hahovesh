import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const LoginFooter: React.FC = () => {
  return (
    <>
      <View className="mt-8 items-center">
        <Text className="text-gray-500 text-base">אין לך חשבון?</Text>
        <TouchableOpacity onPress={() => router.push('/register')} className="mt-2">
          <Text className="text-blue-700 font-semibold text-lg">הרשמה כאן</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-8 py-2"
        onPress={() => router.back()}
      >
        <Text className="text-gray-500 text-base">חזרה לדף הבית</Text>
      </TouchableOpacity>
    </>
  );
};

export default LoginFooter;