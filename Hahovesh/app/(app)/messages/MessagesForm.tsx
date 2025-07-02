import messageFormSchema from "@/data/MessagesSchema";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import { MessageField } from "@/data/MessagesSchema";
import { sendMessageToDB } from "@/services/messages";
import { SafeAreaView } from "react-native-safe-area-context";
import MessagesFormHeader from "./MessagesFormHeader";
import { useUserContext } from "@/hooks/UserContext";
import { useError } from "@/hooks/UseError";
import tw from 'twrnc';

export default function MessagesForm() {
  const [form, setForm] = useState<{ [key: string]: string }>({
    distribution_by_role: "All",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("All");
  const [items, setItems] = useState(
    messageFormSchema.find((f) => f.key === "distribution_by_role")?.options || []
  );

  const { user } = useUserContext();
  const { cleanError, setErrorMessage } = useError();

  const onSubmit = async () => {
    cleanError();
    if (isSubmitting) return;
    if (!form.message_description?.trim()) {
      Alert.alert("שגיאה", "יש למלא את תוכן ההודעה");
      return;
    }
    setIsSubmitting(true);

    try {
      await sendMessageToDB(
        form.message_description,
        form.distribution_by_role,
        user.id
      );
      setForm({ message_description: "", distribution_by_role: "All" });
      setValue("All");
    } catch (error) {
      setErrorMessage("אירעה שגיאה בשליחת ההודעה");
    } finally {
      setIsSubmitting(false);
      Keyboard.dismiss();
    }
  };

  const renderField = (field: MessageField) => {
    if (field.key === "distribution_by_role") return null;

    if (field.type === "text") {
      return (
        <TextInput
          placeholder={field.placeholder}
          placeholderTextColor="#9ca3af"
          value={form[field.key] || ""}
          onChangeText={(val) => setForm({ ...form, [field.key]: val })}
          multiline={true}
          numberOfLines={6}
          textAlign="right"
          style={tw`border p-3 rounded h-36 text-right`}
        />
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={tw`flex-1`}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={tw`flex-1 bg-white`}>
          <StatusBar barStyle="dark-content" />

          <View style={tw`flex-1 bg-white`}>
            <MessagesFormHeader />

            <View style={tw`px-5 pt-5`}>
              {messageFormSchema.map((field) => (
                <View key={field.key} style={tw`mb-4`}>
                  <Text style={tw`text-lg font-bold mb-2 text-right`}>
                    {field.label}
                  </Text>
                  {renderField(field)}
                </View>
              ))}

              <View style={tw`mb-4 z-50`}>
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
                  textStyle={{ textAlign: "right" }}
                  zIndex={1000}
                  onChangeValue={(val) => {
                    setForm({ ...form, distribution_by_role: val ?? "" });
                  }}
                />
              </View>

              <Pressable
                onPress={onSubmit}
                disabled={isSubmitting}
                style={tw`${isSubmitting ? "bg-gray-400" : "bg-green-600"} mx-5 my-6 py-3 rounded-full items-center`}
              >
                <Text style={tw`text-white font-bold text-lg`}>
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