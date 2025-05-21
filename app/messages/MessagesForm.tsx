import messageFormSchema from "@/services/MessagesSchema";
import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { MessageField } from "@/services/MessagesSchema";
import { sendMessageToDB } from "@/services/messages";

export default function MessagesForm() {
  const [form, setForm] = useState<{ [key: string]: string }>({
    message_description: "",
    distribution_by_role: "All",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    if (isSubmitting) return;
    if (!form.message_description?.trim()) {
      console.error("שגיאה: תוכן ההודעה לא יכול להיות ריק");
      Alert.alert("שגיאה", "יש למלא את תוכן ההודעה");
      return;
    }
    setIsSubmitting(true);

    try {
      await sendMessageToDB(form);
      console.log("ההודעה נשלחה בהצלחה");
    } catch (error) {
      console.error("שגיאה בשליחת ההודעה:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: MessageField) => {
    switch (field.type) {
      case "text":
        return (
          <TextInput
            placeholder={field.placeholder}
            value={form[field.key] || ""}
            onChangeText={(val) => setForm({ ...form, [field.key]: val })}
            className="border p-2 rounded"
          />
        );
      case "picker":
        return (
          <Picker
            selectedValue={form[field.key] || "All"}
            onValueChange={(val) => setForm({ ...form, [field.key]: val })}
          >
            {field.options?.map((opt) => (
              <Picker.Item
                key={opt.value}
                label={opt.label}
                value={opt.value}
              />
            ))}
          </Picker>
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

      <ScrollView className="px-5 pt-5">
        {messageFormSchema.map((field) => (
          <View key={field.key} className="mb-4">
            <Text className="text-lg font-bold">{field.label}</Text>
            {renderField(field)}
          </View>
        ))}
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
      </ScrollView>
    </View>
  );
}
