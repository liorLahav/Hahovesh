import messageFormSchema from "@/data/MessagesSchema";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import { MessageField } from "@/data/MessagesSchema";
import { sendMessageToDB } from "@/services/messages";
import { SafeAreaView } from "react-native-safe-area-context";
import MessagesHeader from "./MessagesHeader";
import { router } from "expo-router";
import MessagesFormHeader from "./MessagesFormHeader";

export default function MessagesForm() {
  const [form, setForm] = useState<{ [key: string]: string }>({
    // message_description: "",
    distribution_by_role: "All",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // dropdown state
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("All");
  const [items, setItems] = useState(
    messageFormSchema.find((f) => f.key === "distribution_by_role")?.options ||
      []
  );

  const onSubmit = async () => {
    if (isSubmitting) return;
    if (!form.message_description?.trim()) {
      Alert.alert("שגיאה", "יש למלא את תוכן ההודעה");
      return;
    }
    setIsSubmitting(true);

    try {
      await sendMessageToDB(form);
      console.log("ההודעה נשלחה בהצלחה");
      setForm({ message_description: "", distribution_by_role: "All" });
      setValue("All");
    } catch (error) {
      console.error("שגיאה בשליחת ההודעה:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: MessageField) => {
    if (field.key === "distribution_by_role") return null;

    if (field.type === "text") {
      return (
        <TextInput
          placeholder={field.placeholder}
          value={form[field.key] || ""}
          onChangeText={(val) => setForm({ ...form, [field.key]: val })}
          multiline
          numberOfLines={6}
          textAlign="right"
          className="border p-3 rounded h-36"
        />
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar barStyle="dark-content" />

          <View className="flex-1 bg-white">
            <MessagesFormHeader />

            <View className="px-5 pt-5">
              {messageFormSchema.map((field) => (
                <View key={field.key} className="mb-4">
                  <Text className="text-lg font-bold mb-2 text-right">
                    {field.label}
                  </Text>
                  {renderField(field)}
                </View>
              ))}

              <View className="mb-4 z-50">
                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder="בחר תפקיד"
                  style={{ height: 50 }}
                  dropDownContainerStyle={{ zIndex: 1000 }}
                  zIndex={1000}
                  onChangeValue={(val) => {
                    setForm({ ...form, distribution_by_role: val ?? "" });
                  }}
                />
              </View>

              <Pressable
                onPress={onSubmit}
                disabled={isSubmitting}
                className={`mx-5 my-6 py-3 rounded-full items-center ${
                  isSubmitting ? "bg-gray-400" : "bg-green-600"
                }`}
              >
                <Text className="text-white font-bold text-lg">
                  {isSubmitting ? "שולח..." : "שלח הודעה"}
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
