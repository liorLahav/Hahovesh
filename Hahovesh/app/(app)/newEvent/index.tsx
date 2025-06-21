import { ScrollView, Text, Alert, View, StatusBar } from "react-native";
import formSchema from "../../../data/formSchema";
import DynamicForm from "../../../components/DynamicForm";
import { useState } from "react";
import { createEvent } from "@/services/events";
import NewEventHeader from "./newEventHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function NewEventScreen() {
  const [formKey, setFormKey] = useState(0);
  /** Push a new event object to RTDB */
  const onSubmit = async (values: Record<string, string>) => {
    try{
      await createEvent(values, () => setFormKey((k) => k + 1))
      Alert.alert("הצלחה", "האירוע נוצר בהצלחה",[        {
        text: "OK",
        onPress: () => {
          router.replace("/home");
        }
      }]);
    }
    catch (error) {
      console.error("Error creating event:", error);
      Alert.alert("שגיאה", "אירעה שגיאה ביצירת האירוע, אנא פנה למנהל המערכת")
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" />

        <NewEventHeader />

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <Text className="text-2xl font-bold mb-6 text-right text-blue-700">
            פרטי האירוע
          </Text>

          <DynamicForm key={formKey} schema={formSchema} onSubmit={onSubmit} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
