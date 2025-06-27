// app/operationEvent/OperationEvent.tsx
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { use, useEffect, useState } from "react";
import { useEventContext } from "@/hooks/EventContext";
import { sendMessageToDB } from "@/services/messages";
import { router } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";
import { fetchEvent, updateStartEndEvent } from "@/services/events";
import { update } from "firebase/database";
import { updateUserStatus } from "@/services/users";
import { updateFinishedEventsCount } from "@/services/globalStatsService";

export default function OperationEvent() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [otherText, setOtherText] = useState<string>("");
  const { user,setIsAvailable } = useUserContext();
  const { event, changeActiveStatus,refreshEvent } = useEventContext();
  const { id: eventId, anamnesis: eventTitle } = event;
  const [isFirstVolunteer, setIsFirstVolunteer] = useState(false);

  const options = ["קריאה לחובש נוסף", "קריאה לאמבולנס","קריאה לאמבולנס חירום", "אחר"];

  const handleSend = async () => {
    if (!selectedOption) {
      Alert.alert("נא לבחור אפשרות");
      return;
    }
    try {
      const description = `לאירוע -  ${eventTitle} צריך : ${
        selectedOption === "אחר" ? otherText : selectedOption.slice(7)
      }`;
      await sendMessageToDB(description, "All", user.id,true);
      Alert.alert("הבקשה נשלחה");
      setSelectedOption("");
      setOtherText("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("שגיאה", "לא ניתן לשלוח את הבקשה, אנא פנה למנהל");
    }
  };


  const handleEnd = async () => {
    refreshEvent();
    const fetchedEvent = await fetchEvent(eventId);
    if (!fetchedEvent || !fetchedEvent.volunteers ) {
      Alert.alert("אין מתנדבים לאירוע");
      return;
    }
    const volunteersArr = fetchedEvent?.volunteers
    ? Object.values(fetchedEvent.volunteers).sort(
        (a, b) => (a.joinedAt ?? 0) - (b.joinedAt ?? 0)
      )
    : [];
    changeActiveStatus(false);
    if (volunteersArr[0]?.volunteerId === user.id) {
      updateStartEndEvent(user.id, eventId);
      router.replace("/endEvent");
    } else {
      Alert.alert("האירוע נגמר", "תודה על העזרה! , חזרה למסך בית");
      changeActiveStatus(false);
      updateUserStatus(user.id, "available");
      updateFinishedEventsCount(user.id,false);
      setIsAvailable(true);
      router.replace("/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center">
        <Text className="text-3xl font-bold text-white tracking-wide">
          {eventTitle}
        </Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-3xl text-blue-800 font-bold mb-4 items-center text-right">
          מה הצורך שלך?
        </Text>

        {options.map((opt) => (
          <Pressable
            key={opt}
            onPress={() => setSelectedOption(opt)}
            className={`py-3 px-4 mb-2 rounded-xl border ${
              selectedOption === opt
                ? "bg-blue-400 border-blue-500"
                : "bg-blue-50 border-blue-300"
            } items-center`}
          >
            <Text
              className={`text-lg ${
                selectedOption === opt
                  ? "text-white font-bold"
                  : "text-blue-800"
              }`}
            >
              {opt}
            </Text>
          </Pressable>
        ))}

        {selectedOption === "אחר" && (
          <TextInput
            className="border border-blue-300 rounded-xl p-4 mb-6 text-right text-lg bg-white"
            placeholder="פרט מה הצורך"
            value={otherText}
            onChangeText={setOtherText}
          />
        )}

        <Pressable
          onPress={handleSend}
          className="bg-green-600 rounded-full py-4 mb-4 items-center shadow-lg elevation-5"
        >
          <Text className="text-lg text-white font-bold">שלח</Text>
        </Pressable>

        <Pressable
          onPress={handleEnd}
          className="bg-red-600 rounded-full py-4 items-center shadow-lg elevation-5"
        >
          <Text className="text-lg text-white font-bold">סיום אירוע</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
