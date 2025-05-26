import messageFormSchema from "@/services/MessagesSchema";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import { MessageField } from "@/services/MessagesSchema";
import { sendMessageToDB } from "@/services/messages";

export default function MessagesForm() {
  const [form, setForm] = useState<{ [key: string]: string }>({
    // message_description: "",
    distribution_by_role: "",
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
    <View className="flex-1 bg-white">
      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text
          className="text-3xl text-white tracking-wide"
          style={{ fontFamily: "Assistant-Bold" }}
        >
          שליחת הודעה
        </Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" />
      </View>

      <View className="px-5 pt-5">
        {messageFormSchema.map((field) => (
          <View key={field.key} className="mb-4">
            <Text className="text-lg font-bold mb-2">{field.label}</Text>
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
              setForm({ ...form, distribution_by_role: val });
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
  );
}
