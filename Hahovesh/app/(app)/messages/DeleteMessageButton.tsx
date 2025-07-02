import { Alert, Pressable } from "react-native";
import { deleteMessage } from "@/services/messages";
import { Ionicons } from "@expo/vector-icons";
import { useError } from "@/hooks/UseError";
import tw from 'twrnc';

export default function DeleteMessageButton({ msgId }: { msgId: string }) {
  const { setErrorMessage, cleanError } = useError();

  const handleDeleteMessage = async () => {
    try {
      cleanError();
      await deleteMessage(msgId);
    } catch (err) {
      setErrorMessage("שגיאה במחיקת הודעה");
    }
  };

  return (
    <Pressable
      onPress={() => {
        Alert.alert("האם אתה בטוח?", "לאחר המחיקה לא תוכל לשחזר הודעה", [
          { text: "ביטול", style: "cancel" },
          { text: "אישור", onPress: handleDeleteMessage },
        ]);
      }}
      style={tw``}
    >
      <Ionicons name="trash-outline" size={22} color="red" />
    </Pressable>
  );
}
