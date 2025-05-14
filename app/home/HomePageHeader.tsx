import { View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import NotificationButton from "./NotificationIcon";
import { useRouter } from "expo-router";
import logo from "../../assets/images/logo.png"; 

export default function HomePageHeader() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>(); // Use the navigation prop to open the drawer only (not the router)
  const router = useRouter();

  return (
    <>
      <View className="w-full h-1 bg-red-500 rounded-t-xl" />
      <View className="w-full bg-blue-100 shadow-sm p-2 rounded-b-md">
        <View className="flex-row-reverse items-center justify-between mb-2">
          <View className="flex-row-reverse items-center space-x-reverse space-x-2">
            <Image
              source={logo}
              style={{ width: 45, height: 45 }}
              resizeMode="contain"
            />
            <View>
              <Text className="text-2xl font-bold text-blue-700">
                החובש הר נוף
              </Text>
              <Text className="text-base text-blue-700">
                ארגון ההצלה השכונתי
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-end gap-4 items-center">
          <Pressable
            onPress={() => router.push(("/home/HomePage") as any)}
            className="p-3"
          >
            {/*unreadCount prop should be dynamic (fix later) */}
            <NotificationButton unreadCount={11} />
          </Pressable>
          <Pressable onPress={() => navigation.openDrawer()} className="p-2">
            <Ionicons name="menu" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    </>
  );
}
