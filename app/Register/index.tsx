import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { router } from "expo-router";
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
    <SafeAreaView className="flex-1 bg-blue-200">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center justify-center px-4 py-8">
          <Text className="text-3xl font-bold text-blue-800 mb-8 text-center">
            רישום מתנדבים
          </Text>

          {successMessage && <SuccessMessage />}
          
          {conflictMessage && (
            <ConflictMessage
              conflictDetails={conflictDetails}
              conflictMessage={conflictMessage}
            />
          )}

          {!successMessage && (
            <RegisterForm
              onSuccess={handleSuccess}
              onConflict={handleConflict}
            />
          )}

          <TouchableOpacity
            className="mt-8 py-2"
            onPress={() => router.back()}
          >
            <Text className="text-gray-500 text-base"> עבור להתחברות </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}