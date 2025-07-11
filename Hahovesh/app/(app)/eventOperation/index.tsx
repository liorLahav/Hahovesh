import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEventContext } from "@/hooks/EventContext";
import { sendMessageToDB } from "@/services/messages";
import { router } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";
import { fetchEvent, updateStartEndEvent } from "@/services/events";
import { updateUserStatus } from "@/services/users";
import { updateFinishedEventsCount } from "@/services/globalStatsService";
import tw from "twrnc";

export default function OperationEvent() {
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const { user, setIsAvailable } = useUserContext();
  const { event, changeActiveStatus, refreshEvent } = useEventContext();
  const { id: eventId, medical_code: eventTitle } = event;

  const options = [
    "קריאה לחובש נוסף",
    "קריאה לאמבולנס",
    "קריאה לאמבולנס חירום",
    "אחר",
  ];

  const handleSend = async () => {
    if (!selectedOption) {
      Alert.alert("נא לבחור אפשרות");
      return;
    }
    try {
      const description =
        `לאירוע - ${eventTitle} צריך : ${
          selectedOption === "אחר" ? otherText : selectedOption
        }`;
      await sendMessageToDB(description, "All", user.id, true);
      Alert.alert("הבקשה נשלחה");
      setSelectedOption("");
      setOtherText("");
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("שגיאה", "לא ניתן לשלוח את הבקשה, אנא פנה למנהל");
    }
  };

  const handleEnd = async () => {
    await refreshEvent();
    const fetched = await fetchEvent(eventId);
    const volunteersArr = fetched?.volunteers
      ? Object.values(fetched.volunteers).sort(
          (a, b) => (a.joinedAt ?? 0) - (b.joinedAt ?? 0)
        )
      : [];
    changeActiveStatus(false);
    if (volunteersArr[0]?.volunteerId === user.id) {
      await updateStartEndEvent(user.id, eventId);
      router.replace("/endEvent");
    } else {
      Alert.alert("האירוע נגמר", "תודה על העזרה! חזרה למסך בית");
      await updateUserStatus(user.id, "available");
      await updateFinishedEventsCount(user.id, false);
      setIsAvailable(true);
      router.replace("/home");
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Top red line */}
      <View style={tw`w-full h-1 bg-red-500 rounded-t-xl`} />

      {/* Header */}
      <View style={tw`bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-2xl shadow-sm`}>
        <Text style={tw`text-2xl font-bold text-blue-700 text-center`}>{eventTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-4 pb-24`}>
        <Text style={tw`text-2xl font-bold text-blue-800 mb-4 text-right`}>מה הצורך שלך?</Text>

        {options.map(opt => (
          <Pressable
            key={opt}
            onPress={() => setSelectedOption(opt)}
            style={tw`py-3 px-4 mb-2 rounded-xl border items-center ${
              selectedOption === opt
                ? 'bg-blue-400 border-blue-500'
                : 'bg-blue-50 border-blue-300'
            }`}
          >
            <Text style={tw`text-lg ${
              selectedOption === opt
                ? 'text-white font-bold'
                : 'text-blue-800'
            }`}>{opt}</Text>
          </Pressable>
        ))}

        {selectedOption === 'אחר' && (
          <TextInput
            style={tw`border border-blue-300 rounded-xl p-4 mb-6 text-right text-lg bg-white`}
            placeholder="פרט מה הצורך"
            value={otherText}
            onChangeText={setOtherText}
          />
        )}

        <Pressable
          onPress={handleSend}
          style={tw`bg-green-600 rounded-full py-4 mb-4 items-center shadow-lg`}
        >
          <Text style={tw`text-lg text-white font-bold`}>שלח</Text>
        </Pressable>

        <Pressable
          onPress={handleEnd}
          style={tw`bg-red-600 rounded-full py-4 items-center shadow-lg`}
        >
          <Text style={tw`text-lg text-white font-bold`}>סיום אירוע</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
