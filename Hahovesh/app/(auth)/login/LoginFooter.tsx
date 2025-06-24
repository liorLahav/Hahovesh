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
    </>
  );
};

export default LoginFooter;