import { View, Text, Image, Pressable } from "react-native";
import NotificationButton from "./NotificationIcon";
import logo from "../../../assets/images/logo.png";
import MenuButton from "@/components/navigation/menuButton";
import { Message } from "@/services/messages";
import { router } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";
import tw from 'twrnc';

type Props = {
  messages: Message[];
};

export default function HomePageHeader({ messages }: Props) {
  const { user, userHasRoles } = useUserContext();
  const userRoles = user?.permissions || [];
  const userId = user.id;
  console.log("messages",messages);
  const countUnreadMessages = messages.filter(
    (msg) =>
      (msg.distribution_by_role === "All" ||
        userHasRoles(msg.distribution_by_role)) &&
      !msg.read_by?.[userId]
  ).length;

  return (
    <>
      <View style={tw`w-full h-1 bg-red-500 rounded-t-xl`} />
      <View style={tw`w-full bg-blue-100 shadow-sm p-[9px] rounded-b-md`}>
        <View style={tw`flex-row-reverse items-center justify-between mb-[5px]`}>
          <View style={tw`flex-row-reverse items-center`}>
            <Image
              source={logo}
              style={{ width: 45, height: 45 }}
              resizeMode="contain"
            />
            <View style={tw`mr-[5px] items-end`}>
              <Text style={tw`text-[22px] font-bold text-blue-700`}>
                החובש הר נוף
              </Text>
              <Text style={tw`text-[13px] text-blue-700`}>
                ארגון ההצלה השכונתי
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row justify-end items-center mr-[3px]`}>
          <Pressable
            onPress={() => router.push("/messages" as any)}
            style={tw`p-[9px]`}
          >
            <NotificationButton unreadCount={countUnreadMessages} />
          </Pressable>
          <MenuButton />
        </View>
      </View>
    </>
  );
}
