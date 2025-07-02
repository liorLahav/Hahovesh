import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

interface StatusMessageProps {
  loginStatus: string;
  welcomeName: string;
  loginError: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ loginStatus, welcomeName, loginError }) => {
  if (loginStatus) {
    return (
      <View style={tw`bg-green-100 border border-green-400 rounded-lg p-4 mb-6 w-full`}>
        <Text style={tw`text-green-700 text-lg font-bold mb-2 text-center`}>
          {loginStatus}
        </Text>
        <Text style={tw`text-green-700 text-base text-center`}>
          ברוך הבא, {welcomeName}!
        </Text>
      </View>
    );
  }

  if (loginError) {
    return (
      <View style={tw`bg-red-100 border border-red-400 rounded-lg p-4 mb-6 w-full`}>
        <Text style={tw`text-red-700 text-base text-center`}>
          {loginError}
        </Text>
      </View>
    );
  }

  return null;
};

export default StatusMessage;
