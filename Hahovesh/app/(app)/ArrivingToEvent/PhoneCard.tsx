import React from "react";
import { Pressable, View, Text, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

type PhoneCardProps = {
  phone: string;
  onSite?: boolean;
};

const PhoneCard = (props: PhoneCardProps) => {
  const handleCall = () => {
    if (props.phone) {
      Linking.openURL(`tel:${props.phone}`);
    }
  };

  return (
    <Pressable
      onPress={handleCall}
      style={tw`bg-white mx-4 mt-4 rounded-xl shadow-md overflow-hidden border border-gray-200 h-28`}
    >
      <View style={tw`flex-1 justify-center items-center p-3`}>  
        <Text style={tw`text-lg text-gray-700 font-bold mb-8 text-center`}>
          {props.phone}
          {props.onSite ? " (נוכח)" : " (לא נוכח)"}
        </Text>
      </View>

      <View style={tw`absolute right-3 top-3 bg-green-600 h-12 w-12 rounded-full items-center justify-center`}>  
        <Ionicons name="call" size={24} color="white" />
      </View>

      <View style={tw`bg-blue-50 py-2 px-3 border-t border-gray-100 absolute bottom-0 w-full`}>  
        <Text style={tw`text-sm text-blue-600 font-medium text-center`}>התקשר</Text>
      </View>
    </Pressable>
  );
};

export default PhoneCard;
