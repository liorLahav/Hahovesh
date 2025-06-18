import { Alert, Pressable } from "react-native";
import { deleteMessage } from "@/services/messages";
import { Ionicons } from "@expo/vector-icons";

export default function DeleteMessageButton({ msgId }: { msgId: string }) {
  const handleDeleteMessage = async () => {
    try {
      await deleteMessage(msgId);
    } catch (err) {
      console.error("שגיאה במחיקת הודעה:", err);
    }
  };

  return (
    <Pressable
      onPress={() => {
        Alert.alert("האם אתה בטוח?", "לאחר המחיקה לא תוכל לשחזר הודעה", [
          {
            text: "ביטול",
            style: "cancel",
          },
          {
            text: "אישור",
            onPress: handleDeleteMessage, // 👈 פשוט מעבירים את הפונקציה
          },
        ]);
      }}
    >
      <Ionicons name="trash-outline" size={22} color="red" />
    </Pressable>
  );
}
