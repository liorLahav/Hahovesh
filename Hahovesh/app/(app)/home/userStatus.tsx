import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { removeExpoToken, updateExpoToken, updateUserStatus } from "@/services/users";
import { useUserContext } from "@/hooks/UserContext";
import { useError } from "@/hooks/UseError";

export default function UserStatus() {
  const [userStatus, setUserStatus] = useState<"available" | "unavailable">(
    "available"
  );
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserContext();
  const { error, cleanError, setErrorMessage } = useError();

  useEffect(() => {
    if (user && user.status) {
      setUserStatus(user.status === "available" ? "available" : "unavailable");
    }
  }, [user]);

  const handlePress = async () => {
    if (isLoading) return;
    cleanError();
    setIsLoading(true);

    try {
      const newStatus =
        userStatus === "available" ? "unavailable" : "available";
      if (newStatus === "available"){
        updateExpoToken(user.id, user.expoPushToken);
      }
      else {
        removeExpoToken(user.id);
      }
      await updateUserStatus(user.id, newStatus);
      setUserStatus(newStatus);
    } catch (error) { 
      console.error("Error updating user status:", error);
      setErrorMessage("שגיאה בעדכון הסטטוס, נסה שוב מאוחר יותר");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-blue-50 rounded-t-2xl shadow-sm border border-blue-50 px-5 py-4 mt-6 w-full">
      <View className="flex-row-reverse items-center justify-between">
        <View className="flex-row-reverse items-center gap-2">
          <Text className="text-xl font-semibold text-gray-800">סטטוס</Text>
          <View
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              userStatus === "available"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <Text>{userStatus === "available" ? "זמין" : "לא זמין"}</Text>
          </View>
        </View>

        <Pressable
          onPress={handlePress}
          disabled={isLoading}
          className={`w-24 h-12 rounded-full p-1 border ${
            userStatus === "available"
              ? "bg-green-400 border-green-500"
              : "bg-red-400 border-red-500"
          } ${isLoading ? "opacity-50" : ""} relative`}
        >
          <View
            className={`w-8 h-8 bg-white rounded-full shadow-md absolute top-[6px] transition-transform duration-600 ease-in-out ${
              userStatus === "available" ? "translate-x-14 " : "translate-x-1"
            }`}
          />
        </Pressable>
      </View>
    </View>
  );
}
