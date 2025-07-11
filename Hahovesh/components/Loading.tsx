import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

type LoadingProps = {
  message?: string;
};

const Loading: React.FC<LoadingProps> = ({ message = "טוען..." }) => {
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text style={tw`text-gray-700`}>{message}</Text>
    </View>
  );
};

export default Loading;
