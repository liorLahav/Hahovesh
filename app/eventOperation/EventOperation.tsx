// app/operationEvent/OperationEvent.tsx

import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { realtimeDb } from "@/FirebaseConfig";
import { ref, push } from "firebase/database";
import { sendEventOperation } from "@/services/events";


type Event = {
  id: string;
  title: string;
  [key: string]: any;
};

export default function OperationEvent() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [eventTitle, setEventTitle] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [otherText, setOtherText] = useState<string>("");

  const options = [
    "קריאה לחובש נוסף",
    "קריאה לאמבולנס",
    "אחר",
  ];

  // add a func or ver to get the data when lior tell

  //sand to the dataBase, need to get the evevt id from lior
  const handleSend = async () => {
  console.log("🔥 handleSend called, selectedOption =", selectedOption);
  if (!selectedOption) {
    alert("יש לבחור אופציה");
    return;
  }

  const success = await sendEventOperation(eventId!, {
    option: selectedOption,
    text: selectedOption === "אחר" ? otherText : null,
    timestamp: Date.now(),
  });

  if (success) {
    Alert.alert("נשלח בהצלחה");
    setSelectedOption("");
    setOtherText("");
  } else {
    Alert.alert("אירעה שגיאה בשליחה");
  }
};


  
  const handleEnd = () => {
      // put the router to endFile after omer will finish
  };

  return (
    <View className="flex-1 bg-white">

      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center">
        <Text className="text-3xl font-bold text-white">טופס אירוע</Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        <Text className="text-2xl font-bold mb-4 text-right text-blue-700">
          תפעול אירוע: {eventTitle}
        </Text>

        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => setSelectedOption(opt)}
            className={`py-3 px-4 mb-2 border rounded ${
              selectedOption === opt
                ? "border-blue-700 bg-blue-100"
                : "border-gray-300"
            }`}
          >
            <Text className="text-base text-right">{opt}</Text>
          </Pressable>
        ))}

        {selectedOption === "אחר" && (
          <TextInput
            className="border border-gray-300 rounded p-3 mb-4 text-right"
            placeholder="פרט מה הצורך"
            value={otherText}
            onChangeText={setOtherText}
          />
        )}

        <Pressable
          onPress={handleSend}
          className="bg-blue-600 rounded-full py-3 mb-4 items-center"
        >
          <Text className="text-white font-bold">שלח</Text>
        </Pressable>

        <Pressable
          onPress={handleEnd}
          className="bg-red-600 rounded-full py-3 items-center"
        >
          <Text className="text-white font-bold">
            סיום אירוע ומילוי דוח סיכום
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
