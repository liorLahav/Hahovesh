import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { loginWithPhoneAndId } from "../../services/login";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [loginStatus, setLoginStatus] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    if (!phone || !identifier) {
      Alert.alert("שדות חסרים", "אנא מלא את כל הפרטים");
      return;
    }

    setLoginStatus("");
    setWelcomeName("");
    setLoginError("");
    setIsLoading(true);

    try {
      const result = await loginWithPhoneAndId(phone, identifier);

      if (!result.success) {
        setLoginError(result.error);
        setIsLoading(false);
        return;
      }

      const volunteerData = result.data;
      setLoginStatus("התחברות הצליחה!");
      setWelcomeName(volunteerData.first_name);

      setTimeout(() => {
        // router.push('/home');
      }, 1500);
    } catch (err) {
      console.error("שגיאת התחברות:", err);
      setLoginError("משהו השתבש במהלך ההתחברות. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-200">
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 items-center justify-center px-4"
      >
        <View className="w-full max-w-xl items-center">
          <Text className="text-3xl font-bold text-blue-800 mb-2 text-center">התחברות</Text>
          <Text className="text-lg text-blue-700 mb-8 text-center">התחבר למשתמש שלך</Text>

          {loginStatus ? (
            <View className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6 w-full">
              <Text className="text-green-700 text-lg font-bold mb-2 text-center">{loginStatus}</Text>
              <Text className="text-green-700 text-base text-center">ברוך הבא, {welcomeName}!</Text>
            </View>
          ) : null}

          {loginError ? (
            <View className="bg-red-100 border border-red-400 rounded-lg p-4 mb-6 w-full">
              <Text className="text-red-700 text-base text-center">{loginError}</Text>
            </View>
          ) : null}

          <View className="mb-4 w-full">
            <Text className="text-blue-900 mb-1 text-right font-semibold">מספר טלפון</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg text-right"
              placeholder="הכנס את מספר הטלפון שלך"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (loginError) setLoginError("");
              }}
              textAlign="right"
            />
          </View>

          <View className="mb-4 w-full">
            <Text className="text-blue-900 mb-1 text-right font-semibold">מספר תעודת זהות</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-lg text-right"
              placeholder="הכנס את תעודת הזהות שלך"
              placeholderTextColor="#888"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (loginError) setLoginError("");
              }}
              textAlign="right"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className={`bg-blue-700 rounded-lg w-full py-3 mt-2 shadow-md items-center ${isLoading ? "opacity-50" : ""}`}
            onPress={handleLogin}
            disabled={isLoading || loginStatus !== ""}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">התחבר</Text>
            )}
          </TouchableOpacity>

          <View className="mt-8 items-center">
            <Text className="text-gray-500 text-base">אין לך חשבון?</Text>
            <TouchableOpacity onPress={() => router.push('/register')} className="mt-2">
              <Text className="text-blue-700 font-semibold text-lg">הרשמה כאן</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-8 py-2"
            onPress={() => router.back()}
          >
            <Text className="text-gray-500 text-base">חזרה לדף הבית</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}