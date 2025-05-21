import messageFormSchema from "@/services/MessagesSchema";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { MessageField } from "@/services/MessagesSchema";

export default function MessagesForm() {
  const [form, setForm] = useState<{ [key: string]: string }>({});

  const renderField = (field: MessageField) => {
    switch (field.type) {
      case "text":
        return (
          <TextInput
            placeholder={field.placeholder}
            value={form[field.key]}
            onChangeText={(val) => setForm({ ...form, [field.key]: val })}
            className="border p-2 rounded"
          />
        );
      case "picker":
        return (
          <Picker
            selectedValue={form[field.key]}
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
          onPress={() => console.log("Sending message:", form)}
          className="bg-green-600 mx-5 my-6 py-3 rounded-full items-center"
        >
          <Text className="text-white font-bold text-lg">שלח הודעה</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
