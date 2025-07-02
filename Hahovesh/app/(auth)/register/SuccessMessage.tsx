import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import tw from "twrnc";

const SuccessMessage: React.FC = () => {
  const router = useRouter();

  return (
    <View style={tw`bg-green-100 border border-green-400 rounded-lg p-4 mb-6 w-full max-w-xl items-center`}>  
      <Text style={tw`text-green-700 text-lg font-bold mb-2 text-center`}>
        ההרשמה התקבלה בהצלחה!
      </Text>
      <Text style={tw`text-green-700 text-base mb-3 text-center`}>
        בקשתך נשלחה וממתינה לאישור מנהל. לאחר אישור תוכל להתחבר למערכת.
      </Text>
    </View>
  );
};

export default SuccessMessage;
