import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';

const LoginFooter: React.FC = () => {
  return (
    <View style={tw`mt-8 items-center`}>  
      <Text style={tw`text-gray-500 text-base`}>אין לך חשבון?</Text>
      <TouchableOpacity onPress={() => router.push('/register')} style={tw`mt-2`}>
        <Text style={tw`text-blue-700 font-semibold text-lg`}>הרשמה כאן</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginFooter;
