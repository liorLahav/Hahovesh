import { View, Text, Pressable, Animated, Easing } from "react-native";
import { useState, useRef, useEffect } from "react";
import { removeExpoToken, updateExpoToken, updateUserStatus } from "@/services/users";
import { useUserContext } from "@/hooks/UserContext";
import { useError } from "@/hooks/UseError";
import tw from 'twrnc';

export default function UserStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAvaliable, setIsAvailable } = useUserContext();
  const { cleanError, setErrorMessage } = useError();
  const translateAnim = useRef(new Animated.Value(isAvaliable ? 42 : 2)).current;

  const handlePress = async () => {
    if (isLoading) return;
    cleanError();
    setIsLoading(true);

    try {
      const newStatus = isAvaliable ? "unavailable" : "available";
      if (newStatus === "available") {
        updateExpoToken(user.id, user.expoPushToken);
      } else {
        removeExpoToken(user.id);
      }
      await updateUserStatus(user.id, newStatus);
      setIsAvailable(!isAvaliable);
    } catch (error) {
      console.error("Error updating user status:", error);
      setErrorMessage("שגיאה בעדכון הסטטוס, נסה שוב מאוחר יותר");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(translateAnim, {
      toValue: isAvaliable ? 42 : 2,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isAvaliable]);

  return (
    <View style={tw`bg-blue-50 rounded-t-2xl shadow-sm border border-blue-50 px-4 py-3 mt-5 w-full`}>
      <View style={tw`flex-row-reverse items-center justify-between`}>
        <View style={tw`flex-row-reverse items-center mr-2`}>
          <Text style={tw`text-[18px] font-semibold text-gray-800 ml-1`}>סטטוס</Text>
          <View
            style={tw`${isAvaliable ? "bg-green-100" : "bg-red-100"} px-3 py-1 rounded-full`}
          >
            <Text style={tw`${isAvaliable ? "text-green-700" : "text-red-700"} text-[13px] font-bold`}>
              {isAvaliable ? "זמין" : "לא זמין"}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handlePress}
          disabled={isLoading}
          style={tw`${isAvaliable ? "bg-green-400 border-green-500" : "bg-red-400 border-red-500"} w-[80px] h-[40px] rounded-full p-[2px] border ${isLoading ? "opacity-50" : ""} relative`}
        >
          <Animated.View
            style={[
              tw`w-[30px] h-[30px] bg-white rounded-full shadow-md absolute top-[4px]`,
              { left: translateAnim }
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
}
