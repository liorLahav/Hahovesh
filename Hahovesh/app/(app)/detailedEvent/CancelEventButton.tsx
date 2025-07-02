import { Pressable, Text, Alert } from "react-native";
import { Event, updateEvent } from "@/services/events";
import { router } from "expo-router";
import { useError } from "@/hooks/UseError";
import tw from 'twrnc';

type Props = {
  event: Event;
};

export default function CancelEventButton({ event }: Props) {
  const { setErrorMessage, cleanError } = useError();

  const handleCancel = async () => {
    cleanError();
    if (event.id) {
      try {
        await updateEvent(event.id, {
          ...event,
          isActive: false,
          canceledAt: Date.now(),
        });
      } catch {
        setErrorMessage("שגיאה בביטול האירוע");
      } finally {
        router.push("/home");
      }
    }
  };

  return (
    <Pressable
      onPress={() => {
        Alert.alert("האם אתה בטוח?", "לאחר ביטול האירוע לא תוכל לשחזר אותו", [
          { text: "ביטול", style: "cancel" },
          { text: "אישור", onPress: handleCancel },
        ]);
      }}
      disabled={!event.isActive}
      style={tw`p-2 rounded-full shadow-md h-[40px] w-full ${
        event.isActive ? "bg-red-600" : "bg-gray-400 opacity-50"
      }`}
    >
      <Text style={tw`text-white font-bold text-base text-center`}>
        {event.isActive ? "ביטול אירוע" : "אירוע בוטל"}
      </Text>
    </Pressable>
  );
}