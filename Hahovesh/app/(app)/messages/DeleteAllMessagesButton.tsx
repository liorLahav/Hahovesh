import { useError } from "@/hooks/UseError";
import { deleteAllMessages } from "@/services/messages";
import { Alert, Pressable, Text } from "react-native";
import tw from 'twrnc';

export default function DeleteAllMessagesButton() {
  const { setErrorMessage, cleanError } = useError();

  const handleDeleteAllMessages = async () => {
    cleanError();
    try {
      await deleteAllMessages();
    } catch (err) {
      setErrorMessage("שגיאה במחיקת ההודעות");
    }
  };

  return (
    <Pressable
      onPress={() => {
        Alert.alert("האם אתה בטוח?", "לאחר המחיקה לא תוכל לשחזר הודעות", [
          { text: "ביטול", style: "cancel" },
          { text: "אישור", onPress: handleDeleteAllMessages },
        ]);
      }}
      style={tw`p-3 rounded-full shadow-md h-[47px] w-full bg-red-600`}
    >
      <Text style={tw`text-white font-bold text-base text-center`}>
        מחיקת כל ההודעות
      </Text>
    </Pressable>
  );
}
