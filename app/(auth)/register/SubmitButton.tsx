import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

type SubmitButtonProps = {
  onPress: () => void;
  isLoading: boolean;
  isDisabled: boolean;
};

const SubmitButton = ({ onPress, isLoading, isDisabled }: SubmitButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-blue-700 rounded-lg w-full max-w-xl py-3 mt-6 shadow-md items-center ${
        isLoading || isDisabled ? "opacity-50" : ""
      }`}
      onPress={onPress}
      disabled={isLoading || isDisabled}
    >
      {isLoading ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator color="#fff" size="small" />
          <Text className="text-white font-semibold mr-2">בודק...</Text>
        </View>
      ) : (
        <Text className="text-white font-semibold text-lg">הרשמה</Text>
      )}
    </TouchableOpacity>
  );
};

export default SubmitButton;