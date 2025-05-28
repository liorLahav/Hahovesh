import { updateUserStatus } from "@/services/users";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { update } from "firebase/database";
import { Pressable, ScrollView, View,Text } from "react-native";
import { useEventContext } from "@/hooks/EventContext";


const user = "Sy79iRZBzqaUey6elxmT";

const ButtonsPanel = () => {
    const { event,changeActiveStatus } = useEventContext();
    const ArrivedToEvent = () => {
        updateUserStatus(user,"At : " + event.id)
            .then(() => {
                console.log("User status updated successfully");
            })
            .catch((error) => {
                console.error("Error updating user status:", error);
            });
            router.push("/eventOperation/EventOperation");
    }
    const CancelEvent = () => {
        updateUserStatus(user,"OnCall")
            .then(() => {
                console.log("User status updated successfully");
            })
            .catch((error) => {
                console.error("Error updating user status:", error);
            });
        changeActiveStatus(false);
        router.push("/home");
    }
    return (      
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
            <View className="mt-8 flex-row justify-between px-2 mb-6">
              <View className="flex-1 items-center">
                <Pressable 
                  onPress={() => {
                    CancelEvent();
                    router.push(("/home") as any);
                  }}
                  className="bg-red-600 h-24 w-24 rounded-full items-center justify-center shadow-lg elevation-5"
                >
                  <Ionicons name="close-outline" size={44} color="white" />
                  <Text className="text-white text-sm mt-1 font-bold">ביטול</Text>
                </Pressable>
              </View>
    
              <View className="flex-1 items-center">
                <Pressable 
                  onPress={() => {
                    ArrivedToEvent();
                  }}
                  className="bg-green-600 h-24 w-24 rounded-full items-center justify-center shadow-lg elevation-5"
                >
                  <Ionicons name="checkmark-outline" size={44} color="white" />
                  <Text className="text-white text-sm mt-1 font-bold">הגעתי</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>);
}
export default ButtonsPanel;