import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { router } from 'expo-router';
import { registerVolunteer } from "../../services/register";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [idError, setIdError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Conflict message states
  const [conflictMessage, setConflictMessage] = useState("");
  const [conflictDetails, setConflictDetails] = useState("");

  // Success message state
  const [successMessage, setSuccessMessage] = useState(false);

  // Validation handlers
  const validateName = (value: string, setError: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => {
    if (!/^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s\u0590-\u05FF]*$/.test(value)) {
      setError(`${fieldName} יכול להכיל רק אותיות`);
      return false;
    }
    setError("");
    return true;
  };

  const validateId = (value: string) => {
    if (!/^\d{9}$/.test(value)) {
      setIdError("תעודת זהות חייבת להכיל 9 ספרות בדיוק");
      return false;
    }
    setIdError("");
    return true;
  };

  const validatePhone = (value: string) => {
    if (!/^05\d{8}$/.test(value)) {
      setPhoneError("מספר הטלפון חייב להתחיל ב-05 ולהכיל 10 ספרות בדיוק");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Input handlers with validation
  const handleFirstNameChange = (text: string) => {
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    const filteredText = text.replace(/[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s\u0590-\u05FF]/g, '');
    setFirstName(filteredText.toLowerCase());
    validateName(filteredText, setFirstNameError, "שם פרטי");
  };

  const handleLastNameChange = (text: string) => {
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    const filteredText = text.replace(/[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s\u0590-\u05FF]/g, '');
    setLastName(filteredText.toLowerCase());
    validateName(filteredText, setLastNameError, "שם משפחה");
  };

  const handleIdChange = (text: string) => {
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    const filteredText = text.replace(/[^\d]/g, '');
    setIdentifier(filteredText);
    validateId(filteredText);
  };

  const handlePhoneChange = (text: string) => {
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    const filteredText = text.replace(/[^\d]/g, '');
    setPhone(filteredText);
    validatePhone(filteredText);
  };

  const handleRegister = async () => {
    setConflictMessage("");
    setConflictDetails("");

    const isFirstNameValid = validateName(firstName, setFirstNameError, "שם פרטי");
    const isLastNameValid = validateName(lastName, setLastNameError, "שם משפחה");
    const isIdValid = validateId(identifier);
    const isPhoneValid = validatePhone(phone);

    if (!isFirstNameValid || !isLastNameValid || !isIdValid || !isPhoneValid) {
      Alert.alert("שגיאת אימות", "אנא תקן את כל שגיאות הטופס לפני השליחה.");
      return;
    }

    if (!firstName || !lastName || !identifier || !phone) {
      Alert.alert("שדות חסרים", "אנא מלא את כל הפרטים.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerVolunteer({ firstName, lastName, identifier, phone });

      if (!result.success) {
        if (result.conflict === "id") {
          setConflictMessage("תעודת זהות רשומה כבר");
          setConflictDetails(`תעודת זהות ${identifier} כבר רשומה למתנדב ${result.details.first_name} ${result.details.last_name}. אם זה אתה, אנא נסה להתחבר במקום זאת.`);
          setIdError("תעודת זהות כבר בשימוש");
        } else if (result.conflict === "phone") {
          setConflictMessage("מספר טלפון רשום כבר");
          setConflictDetails(`מספר הטלפון ${phone} כבר רשום למתנדב ${result.details.first_name} ${result.details.last_name}. אם זה אתה, אנא נסה להתחבר במקום זאת.`);
          setPhoneError("מספר טלפון כבר בשימוש");
        }
        setIsLoading(false);
        return;
      }

      setFirstName("");
      setLastName("");
      setIdentifier("");
      setPhone("");
      setFirstNameError("");
      setLastNameError("");
      setIdError("");
      setPhoneError("");
      setIsLoading(false);

      setSuccessMessage(true);

    } catch (err) {
      console.error("שגיאת רישום:", err);
      Alert.alert("שגיאה", "משהו השתבש בעת ההרשמה. אנא נסה שוב.");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-200">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 items-center justify-center px-4 py-8">
          <Text className="text-3xl font-bold text-blue-800 mb-8 text-center">רישום מתנדבים</Text>

          {successMessage ? (
            <View className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6 w-full max-w-xl items-center">
              <Text className="text-green-700 text-lg font-bold mb-2 text-center">
                ההרשמה התקבלה בהצלחה!
              </Text>
              <Text className="text-green-700 text-base mb-3 text-center">
                בקשתך נשלחה וממתינה לאישור מנהל. לאחר אישור תוכל להתחבר למערכת.
              </Text>
              <TouchableOpacity
                className="bg-blue-700 px-4 py-2 rounded-lg mt-2"
                onPress={() => router.push('/')}
              >
                <Text className="text-white font-semibold">חזרה לדף הבית</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!successMessage && conflictMessage ? (
            <View className="bg-red-100 border border-red-400 rounded-lg p-4 mb-6 w-full max-w-xl">
              <Text className="text-red-700 text-lg font-bold mb-2 text-right">{conflictMessage}</Text>
              <Text className="text-red-700 text-base mb-3 text-right">{conflictDetails}</Text>
              <TouchableOpacity
                className="bg-blue-700 px-4 py-2 rounded-lg self-end"
                onPress={() => router.push('/login')}
              >
                <Text className="text-white font-semibold">עבור להתחברות</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!successMessage && (
            <>
              <Input
                label="שם פרטי"
                value={firstName}
                onChangeText={handleFirstNameChange}
                error={firstNameError}
                placeholder="הכנס שם פרטי (אותיות בלבד)"
              />
              <Input
                label="שם משפחה"
                value={lastName}
                onChangeText={handleLastNameChange}
                error={lastNameError}
                placeholder="הכנס שם משפחה (אותיות בלבד)"
              />
              <Input
                label="תעודת זהות"
                keyboardType="numeric"
                value={identifier}
                onChangeText={handleIdChange}
                maxLength={9}
                error={idError}
                placeholder="הכנס תעודת זהות בת 9 ספרות"
              />
              <Input
                label="טלפון"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                maxLength={10}
                error={phoneError}
                placeholder="הכנס טלפון (05xxxxxxxx)"
              />

              <TouchableOpacity
                className={`bg-blue-700 rounded-lg w-full max-w-xl py-3 mt-6 shadow-md items-center ${(
                  isLoading || !firstName || !lastName || !identifier || !phone ||
                  firstNameError || lastNameError || idError || phoneError || conflictMessage
                ) ? "opacity-50" : ""}`}
                onPress={handleRegister}
                disabled={
                  isLoading || !firstName || !lastName || !identifier || !phone ||
                  !!firstNameError || !!lastNameError || !!idError || !!phoneError ||
                  !!conflictMessage
                }
              >
                {isLoading ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white font-semibold ml-2">בודק...</Text>
                  </View>
                ) : (
                  <Text className="text-white font-semibold text-lg">הרשמה</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            className="mt-8 py-2"
            onPress={() => router.back()}
          >
            <Text className="text-gray-500 text-base">חזרה לדף הבית</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Input({ label, error, ...props }: { label: string, error?: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View className="mb-4 w-full max-w-xl">
      <Text className="text-blue-900 mb-1 text-right font-semibold">{label}</Text>
      <TextInput
        placeholderTextColor="#888"
        className={`bg-white border rounded-lg px-4 py-3 text-lg text-right ${error ? "border-red-400" : "border-gray-300"}`}
        {...props}
      />
      {error ? <Text className="text-red-600 text-sm mt-1 text-right">{error}</Text> : null}
    </View>
  );
}