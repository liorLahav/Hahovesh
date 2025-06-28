import { Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useError } from "@/hooks/UseError";
import { deleteUser } from "@/services/users";

type Props = {
  userId: string;
  refresh: () => void;
};

export default function DeleteUserButton({ userId, refresh }: Props) {
  const { setErrorMessage, cleanError } = useError();

  const handleDeleteMessage = async () => {
    try {
      cleanError();
      console.log("ID:", userId);
      await deleteUser(userId);
      refresh();
    } catch (err) {
      console.error("שגיאה במחיקת המשתמש:", err);
      setErrorMessage("שגיאה במחיקת המשתמש");
    }
  };

  return (
    <Pressable
      onPress={() => {
        Alert.alert("האם אתה בטוח?", "לאחר המחיקה לא תוכל לשחזר משתמש ", [
          {
            text: "ביטול",
            style: "cancel",
          },
          {
            text: "אישור",
            onPress: handleDeleteMessage,
          },
        ]);
      }}
    >
      <Ionicons name="trash-outline" size={21} color="red" />
    </Pressable>
  );
}
