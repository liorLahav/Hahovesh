import { deleteAllMessages } from "@/services/messages";
import { Alert, Pressable, Text } from "react-native";

export default function DeleteAllMessagesButton() {
  const handleDeleteAllMessages = async () => {
    try {
      await deleteAllMessages();
    } catch (err) {
      console.error("שגיאה במחיקת ההודעות:", err);
    }
  };
  return (
    <Pressable
      className="p-3 rounded-full shadow-md h-[40px] w-full bg-red-600 "
      onPress={() => {
        Alert.alert("האם אתה בטוח?", "לאחר המחיקה לא תוכל לשחזר הודעות", [
          {
            text: "ביטול",
            style: "cancel",
          },
          {
            text: "אישור",
            onPress: () => handleDeleteAllMessages(),
          },
        ]);
      }}
    >
      <Text className="text-white font-bold text-base text-center">
        מחיקת כל ההודעות
      </Text>
    </Pressable>
  );
}
