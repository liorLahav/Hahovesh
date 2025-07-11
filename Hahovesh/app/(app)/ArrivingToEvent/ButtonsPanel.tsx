import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, View, Text } from "react-native";
import tw from "twrnc";
import { useEventContext } from "@/hooks/EventContext";
import { addUserArrivalTime, removeVolunteerFromEvent } from "@/services/events";
import { useUserContext } from "@/hooks/UserContext";
import { updateUserStatus } from "@/services/users";
import { useError } from "@/hooks/UseError";

const ButtonsPanel = () => {
  const { event, changeActiveStatus } = useEventContext();
  const { user } = useUserContext();
  const { setErrorMessage, cleanError } = useError();
  const user_id = user.id;

  const ArrivedToEvent = () => {
    cleanError();
    updateUserStatus(user_id, "At : " + event.id)
      .then(() => console.log("User status updated successfully"))
      .catch((error) => {
        console.error("Error updating user status:", error);
        setErrorMessage("שגיאה בעדכון הסטטוס שלך, פנה למנהל");
      });
    addUserArrivalTime(event.id, user_id)
      .then(() => console.log("User arrival time added successfully"))
      .catch((error) => console.error("Error adding user arrival time:", error));
    router.push("/eventOperation");
  };

  const CancelEvent = async () => {
    cleanError();
    try {
      await updateUserStatus(user_id, "available");
      console.log("User status updated successfully");
    } catch (error) {
      console.error("Error updating user status:", error);
      setErrorMessage("שגיאה בעדכון הסטטוס שלך, פנה למנהל");
    }
    try {
      await removeVolunteerFromEvent(event.id, user_id);
      console.log("Volunteer removed from event successfully");
    } catch (error) {
      console.error("Error removing volunteer from event:", error);
      setErrorMessage("שגיאה בהסרתך מהאירוע, פנה למנהל");
    }
    changeActiveStatus(false);
    router.push("/home");
  };

  return (
    <ScrollView
      style={tw`flex-1`}
      contentContainerStyle={tw`p-4`}
    >
      <View style={tw`mt-8 flex-row justify-between px-2 mb-6`}>
        <View style={tw`flex-1 items-center`}>
          <Pressable
            onPress={() => {
              CancelEvent();
              router.push("/home");
            }}
            style={tw`bg-red-600 h-24 w-24 rounded-full items-center justify-center shadow-lg elevation-5`}
          >
            <Ionicons name="close-outline" size={44} color="white" />
            <Text style={tw`text-white text-sm mt-1 font-bold`}>ביטול</Text>
          </Pressable>
        </View>

        <View style={tw`flex-1 items-center`}>
          <Pressable
            onPress={ArrivedToEvent}
            style={tw`bg-green-600 h-24 w-24 rounded-full items-center justify-center shadow-lg elevation-5`}
          >
            <Ionicons name="checkmark-outline" size={44} color="white" />
            <Text style={tw`text-white text-sm mt-1 font-bold`}>הגעתי</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ButtonsPanel;
