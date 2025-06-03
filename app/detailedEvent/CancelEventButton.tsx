import { Pressable, Text, Alert } from "react-native";
import { Event, updateEvent } from "@/services/events";
import { router } from "expo-router";

type Props = {
  event: Event;
};

export default function CancelEventButton({ event }: Props) {
  const handleCancel = async () => {
    if (event.id) {
      try {
        await updateEvent(event.id, {
          ...event,
          isActive: false,
          canceledAt: Date.now(),
        });
      } catch (error) {
        console.error("שגיאה בביטול האירוע:", error);
      } finally {
        router.push("/home");
      }
    }
  };

  return (
    <Pressable
      className={`p-2 rounded-full shadow-md h-[40px] w-full ${
        event.isActive ? "bg-red-600" : "bg-gray-400 opacity-50"
      }`}
      disabled={!event.isActive}
      onPress={() => {
        Alert.alert("האם אתה בטוח?", "לאחר ביטול האירוע לא תוכל לשחזר אותו", [
          {
            text: "ביטול",
            style: "cancel",
          },
          {
            text: "אישור",
            onPress: handleCancel,
          },
        ]);
      }}
    >
      <Text className="text-white font-bold text-base text-center">
        {event.isActive ? "ביטול אירוע" : "אירוע בוטל"}
      </Text>
    </Pressable>
  );
}
