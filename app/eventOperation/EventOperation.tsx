// app/operationEvent/OperationEvent.tsx

import { View, Text, ScrollView, TextInput, Pressable, Alert,} from "react-native";
import { useState, useEffect } from "react";
import { useEventContext } from "@/hooks/EventContext";
import { sendEventOperation, getFirstVolunteerId } from "@/services/events";
import { router } from "expo-router";



// Hard-coded for now; replace with real auth later
const currentUserId = "Sy79iRZBzqaUey6elxmM";

type Event = {
  id: string;
  title: string;
  [key: string]: any;
};

export default function OperationEvent() {
  
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [otherText, setOtherText] = useState<string>("");
  const {event} = useEventContext();
  const { id: eventId, anamnesis: eventTitle } = event;
  const [isFirstVolunteer, setIsFirstVolunteer] = useState(false);
  

  const options = [
    "קריאה לחובש נוסף",
    "קריאה לאמבולנס",
    "אחר",
  ];

  useEffect(() => {
    if (event) {
      const firstId = getFirstVolunteerId((event as any).volunteers);
      setIsFirstVolunteer(firstId === currentUserId);
    }
  }, [event]);


  const handleSend = async () => {
  if (!selectedOption) {
    Alert.alert("יש לבחור אופציה", "שגיאה");
    return;
  }

  try {
    await sendEventOperation(eventId, {
      option: selectedOption,
      text: selectedOption === "אחר" ? otherText : null,
      timestamp: Date.now(),
    });
    Alert.alert("הבקשה נשלחה");
    setSelectedOption("");            
    setOtherText("");
      } catch (e: any) {
        Alert.alert("אירעה שגיאה בשליחה", e.message || "");
      }
};
  
  const handleEnd = () => {
     if (isFirstVolunteer) {

      // put the router to endFile after omer will finish
     }else{
        Alert.alert("האירוע נגמר", "תודה על העזרה! , חזרה למסך בית");
        router.replace("/home");
     }


  };

  return (
    <View className="flex-1 bg-white">

      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center">
        <Text className="text-3xl font-bold text-white">תפעול אירוע</Text>
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
              ? "bg-blue-400"
              : "bg-gray-100"
          } items-center`}
        >
          <Text
            className={`text-lg text-center ${
              selectedOption === opt ? "text-white font-bold" : "text-gray-800"
            }`}
          >
            {opt}
          </Text>
        </Pressable>
      ))}

        {selectedOption === "אחר" && (
          <TextInput
            className="border border-gray-300 rounded p-4 mb-6 text-right text-lg "
            placeholder="פרט מה הצורך"
            value={otherText}
            onChangeText={setOtherText}
          />
        )}

        <Pressable
          onPress={handleSend}
          className="bg-green-600 rounded-full py-4 mb-4 items-center"
        >
          <Text className="text-lg text-white font-bold">שלח</Text>
        </Pressable>

        <Pressable
          onPress={handleEnd}
          className="bg-red-600 rounded-full py-4 items-center"
        >
          <Text className="text-lg text-white font-bold">
             {isFirstVolunteer
            ? "סיום אירוע ומילוי דוח סיכום"
            : "סיום אירוע"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
