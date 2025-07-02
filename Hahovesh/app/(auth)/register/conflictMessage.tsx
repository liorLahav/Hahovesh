import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";

type ConflictMessageProps = {
  conflictMessage: string;
  conflictDetails: string;
};

const ConflictMessage: React.FC<ConflictMessageProps> = ({ conflictMessage, conflictDetails }) => {
  const router = useRouter();

  return (
    <View style={tw`bg-red-100 border border-red-400 rounded-lg p-4 mb-6 w-full max-w-xl`}>  
      <Text style={tw`text-red-700 text-lg font-bold mb-2 text-right`}>{conflictMessage}</Text>
      <Text style={tw`text-red-700 text-base mb-3 text-right`}>{conflictDetails}</Text>
      <TouchableOpacity
        onPress={() => router.push('../Login')}
        style={tw`bg-blue-700 px-4 py-2 rounded-lg self-end`}
      >
        <Text style={tw`text-white font-semibold`}>עבור להתחברות</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConflictMessage;
