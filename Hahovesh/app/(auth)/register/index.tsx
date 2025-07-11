import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ViewStyle } from "react-native";
import { router } from "expo-router";
import tw from "twrnc";
import RegisterForm from "./RegisterForm";
import SuccessMessage from "./SuccessMessage";
import ConflictMessage from "./conflictMessage";

export default function Register() {
  const [conflictMessage, setConflictMessage] = useState("");
  const [conflictDetails, setConflictDetails] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSuccess = () => {
    setSuccessMessage(true);
  };

  const handleConflict = (message: string, details: string) => {
    setConflictMessage(message);
    setConflictDetails(details);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-blue-200`}>
      <ScrollView
        contentContainerStyle={tw`flex-grow`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`flex-1 items-center justify-center px-4 py-8`}>
          <Text style={tw`text-3xl font-bold text-blue-800 mb-8 text-center`}>
            רישום מתנדבים
          </Text>

          {successMessage && <SuccessMessage />}

          {conflictMessage !== "" && (
            <ConflictMessage
              conflictMessage={conflictMessage}
              conflictDetails={conflictDetails}
            />
          )}

          {!successMessage && (
            <RegisterForm
              onSuccess={handleSuccess}
              onConflict={handleConflict}
            />
          )}

          <TouchableOpacity
            onPress={() => router.replace("/login")}
            style={tw`mt-8 py-2` as ViewStyle}
          >
            <Text style={tw`text-gray-500 text-base text-center`}>
              עבור להתחברות
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
