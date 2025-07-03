import React, { useState } from "react";
import { View, Alert, TouchableOpacity, Text } from "react-native";
import registerSchema from "../../../data/registerSchema";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import TermsModal from "./TermsModal";
import { createUser } from "@/services/users";

type RegisterFormProps = {
  onSuccess: () => void;
  onConflict: (message: string, details: string) => void;
};
const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    return "+972" + cleaned.substring(1);
  } else if (!cleaned.startsWith("+")) {
    return "+972" + cleaned;
  }

  return cleaned;
}

const RegisterForm = ({ onSuccess, onConflict }: RegisterFormProps) => {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    identifier: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    identifier: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [termsChecked, setTermsChecked] = useState(false);
  const [isTermsModalVisible, setTermsModalVisible] = useState(false);

  // Handle input change based on schema validation
  const handleInputChange = (key: string, value: string) => {
    const fieldSchema = registerSchema.find((field) => field.key === key);
    if (!fieldSchema) return;

    // Apply filter if defined
    let filteredValue = value;
    if (fieldSchema.validation?.filter) {
      filteredValue = fieldSchema.validation.filter(value);
    }

    // Update form value
    setFormValues((prev) => ({
      ...prev,
      [key]: filteredValue,
    }));

    // Validate input
    let errorMessage = "";
    if (
      fieldSchema.validation?.regex &&
      !fieldSchema.validation.regex.test(filteredValue)
    ) {
      errorMessage = fieldSchema.validation.errorMessage;
    }

    // Update form error
    setFormErrors((prev) => ({
      ...prev,
      [key]: errorMessage,
    }));
  };

  const handleRegister = async () => {
    // Validate all fields based on schema
    let hasErrors = false;
    const newErrors = { ...formErrors };

    registerSchema.forEach((field) => {
      const value = formValues[field.key as keyof typeof formValues];
      if (
        field.validation?.regex &&
        !field.validation.regex.test(value as string)
      ) {
        newErrors[field.key as keyof typeof formErrors] =
          field.validation.errorMessage;
        hasErrors = true;
      }
    });

    setFormErrors(newErrors);

    if (hasErrors) {
      Alert.alert("שגיאת אימות", "אנא תקן את כל שגיאות הטופס לפני השליחה.");
      return;
    }

    // Check for empty fields
    const { firstName, lastName, identifier, phone } = formValues;
    if (!firstName || !lastName || !identifier || !phone) {
      Alert.alert("שדות חסרים", "אנא מלא את כל הפרטים.");
      return;
    }
    const values = { ...formValues };
    values.phone = formatPhoneNumber(phone);
    setIsLoading(true);

    try {
      const result = await createUser(values);

      if (!result.success) {
        if (result.conflict === "id") {
          onConflict(
            "תעודת זהות רשומה כבר",
            `תעודת זהות ${identifier} כבר רשומה למתנדב ${result.details.first_name} ${result.details.last_name}. אם זה אתה, אנא נסה להתחבר במקום זאת.`
          );
          setFormErrors((prev) => ({
            ...prev,
            identifier: "תעודת זהות כבר בשימוש",
          }));
        } else if (result.conflict === "phone") {
          onConflict(
            "מספר טלפון רשום כבר",
            `מספר הטלפון ${phone} כבר רשום למתנדב ${result.details.first_name} ${result.details.last_name}. אם זה אתה, אנא נסה להתחבר במקום זאת.`
          );
          setFormErrors((prev) => ({ ...prev, phone: "מספר טלפון כבר בשימוש" }));
        }
        setIsLoading(false);
        return;
      }

      // Reset form on success
      setFormValues({
        firstName: "",
        lastName: "",
        identifier: "",
        phone: "",
      });

      setFormErrors({
        firstName: "",
        lastName: "",
        identifier: "",
        phone: "",
      });

      setIsLoading(false);
      onSuccess();
    } catch (err) {
      console.error("שגיאת רישום:", err);
      Alert.alert("שגיאה", "משהו השתבש בעת ההרשמה. אנא נסה שוב.");
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const { firstName, lastName, identifier, phone } = formValues;
    const {
      firstName: firstNameError,
      lastName: lastNameError,
      identifier: idError,
      phone: phoneError,
    } = formErrors;

    return (
      firstName &&
      lastName &&
      identifier &&
      formatPhoneNumber(phone) &&
      !firstNameError &&
      !lastNameError &&
      !idError &&
      !phoneError
    );

    const handleRegister = async () => {
    if (!termsChecked) {
      Alert.alert(
        "יש להסכים לתנאי השימוש",
        "על מנת להמשיך, יש לאשר את תנאי השימוש."
      );
      return;
    }
  }
    
  };

  return (
    <View className="w-full max-w-xl items-center self-center">
      {registerSchema.map((field) => (
        <FormInput
          key={field.key}
          label={field.label}
          value={formValues[field.key as keyof typeof formValues]}
          onChangeText={(text) => handleInputChange(field.key, text)}
          error={formErrors[field.key as keyof typeof formErrors]}
          placeholder={field.placeholder || ""}
          keyboardType={field.keyboardType || "default"}
          maxLength={field.maxLength}
        />
      ))}
    
      <View className="flex-row-reverse items-start w-full max-w-xl mt-4">
        <TouchableOpacity
          onPress={() => setTermsChecked((prev) => !prev)}
          disabled={isLoading}
          className="ml-2"
        >
          <View
            className={`w-5 h-5 border border-gray-400 rounded-sm justify-center items-center`}
      >
          {termsChecked && (
          <Text className="text-blue-700 font-bold">✓</Text>
        )}
          </View>
        </TouchableOpacity>
          <Text className="text-gray-700 text-base text-right">
            אני מסכים/ה ל
            <Text
            onPress={() => setTermsModalVisible(true)}
            className="text-blue-700 font-semibold"
            >
              {" "}
              תנאי השימוש
          </Text>
        </Text>
      </View>



      <SubmitButton
        onPress={handleRegister}
        isLoading={isLoading}
        isDisabled={!isFormValid() || !termsChecked}
      />
      <TermsModal
        visible={isTermsModalVisible}
        onClose={() => setTermsModalVisible(false)}
      />
    </View>
  );
};

export default RegisterForm;