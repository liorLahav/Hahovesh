import React from "react";
import { View, Text, TextInput } from "react-native";
import tw from "twrnc";

type FormInputProps = {
  label: string;
  error?: string;
} & React.ComponentProps<typeof TextInput>;

const FormInput = ({ label, error, ...props }: FormInputProps) => {
  return (
    <View style={tw`mb-4 w-full max-w-xl`}>
      <Text style={tw`text-blue-900 mb-1 text-right font-semibold`}>{label}</Text>
      <TextInput
        placeholderTextColor="#888"
        style={tw`bg-white border rounded-lg px-4 py-3 text-lg text-right ${error ? 'border-red-400' : 'border-gray-300'}`}
        {...props}
      />
      {error ? (
        <Text style={tw`text-red-600 text-sm mt-1 text-right`}>{error}</Text>
      ) : null}
    </View>
  );
};

export default FormInput;
