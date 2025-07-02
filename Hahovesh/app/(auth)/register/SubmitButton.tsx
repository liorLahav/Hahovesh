import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import tw from "twrnc";

type SubmitButtonProps = {
  onPress: () => void;
  isLoading: boolean;
  isDisabled: boolean;
};

const SubmitButton = ({ onPress, isLoading, isDisabled }: SubmitButtonProps) => {
  const disabled = isLoading || isDisabled;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={tw`bg-blue-700 rounded-lg w-full max-w-xl py-3 mt-6 shadow-md items-center ${disabled ? 'opacity-50' : 'opacity-100'}`}
    >
      {isLoading ? (
        <View style={tw`flex-row items-center justify-center`}>  
          <ActivityIndicator color="#fff" size="small" />
          <Text style={tw`text-white font-semibold mr-2`}>בודק...</Text>
        </View>
      ) : (
        <Text style={tw`text-white font-semibold text-lg`}>הרשמה</Text>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;
