import { View, Text, Image, Pressable } from "react-native";
import NotificationButton from "./NotificationIcon";
import logo from "../../../assets/images/logo.png";
import MenuButton from "@/components/navigation/menuButton";
import { Message } from "@/services/messages";
import { router } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";

type Props = {
  messages: Message[];
};

export default function HomePageHeader({ messages }: Props) {
  const { user, userHasRoles } = useUserContext();
  const userRoles = user.permissions || [];
  const userId = user.id;
  const countUnreadMessages = messages.filter(
    (msg) =>
      (msg.distribution_by_role === "All" ||
        userHasRoles(msg.distribution_by_role)) &&
      !msg.read_by?.[userId]
  ).length;

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
            onPress={() => router.push("/messages" as any)}
            className="p-3"
          >
            {/*unreadCount prop should be dynamic (fix later) */}
            <NotificationButton unreadCount={countUnreadMessages} />
          </Pressable>
          <MenuButton />
        </View>
      </View>
    </>
  );
}
