import { useError } from "@/hooks/UseError";
import { deleteAllMessages } from "@/services/messages";
import { set } from "firebase/database";
import { Alert, Pressable, Text } from "react-native";

export default function DeleteAllMessagesButton() {
  const { setErrorMessage, cleanError } = useError();
  const handleDeleteAllMessages = async () => {
    cleanError();
    try {
      await deleteAllMessages();
    } catch (err) {
      console.error("שגיאה במחיקת ההודעות:", err);
      setErrorMessage("שגיאה במחיקת ההודעות");
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
