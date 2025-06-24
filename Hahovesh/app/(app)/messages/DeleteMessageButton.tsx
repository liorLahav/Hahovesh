import { Alert, Pressable } from "react-native";
import { deleteMessage } from "@/services/messages";
import { Ionicons } from "@expo/vector-icons";
import { useError } from "@/hooks/UseError";

export default function DeleteMessageButton({ msgId }: { msgId: string }) {
  const { setErrorMessage, cleanError } = useError();

  const handleDeleteMessage = async () => {
    try {
      cleanError(); 
      console.log("ID:", msgId);
      await deleteMessage(msgId); // 👈 כאן תכניס את ה-ID של ההודעה שברצונך למחוק
    } catch (err) {
      console.error("שגיאה במחיקת הודעה:", err);
      setErrorMessage("שגיאה במחיקת הודעה");
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
