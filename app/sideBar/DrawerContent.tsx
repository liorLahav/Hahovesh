import { DrawerContentScrollView } from "@react-navigation/drawer";
import { SafeAreaView, View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {drawerItems} from "../../data/DrawerRoutes";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { signOutUser } from "@/services/login";

export default function DrawerContent(
  props: DrawerContentComponentProps & { userRole: string[] }
) {
  const router = useRouter();

  let roleLevel = 0;
  if (props.userRole.includes("Admin")) roleLevel = 2;
  else if (props.userRole.includes("Dispatcher")) roleLevel = 1;

  const filteredItems = drawerItems.filter((item) => roleLevel >= item.minRole);

  const sections = {
    account: filteredItems.filter((i) => i.section === "account"),
    menu: filteredItems.filter((i) => i.section === "menu"),
  };
  const signOut = () => {
    // Implement sign out logic here
    Alert.alert("התנתקות", "האם אתה בטוח שברצונך להתנתק?", [
      {
        text: "לא",
        style: "cancel",
      },
      {
        text: "כן",
        onPress: () => {
          router.replace("/Login");
        },
      },
    ]);
  }

  const renderSection = (title: string, items: typeof filteredItems) => (
    <>
      <Text className="w-full text-right mb-2 text-xl border-b border-gray-500 px-2 py-4">
        {title}
      </Text>
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => router.push(("/" + item.route) as any)}
          className="p-3 rounded-lg hover:bg-gray-200 mt-2 w-full border-b border-gray-200"
        >
          <View className="flex-row-reverse items-center gap-4 p-2 mr-4">
            <Ionicons name={item.icon as any} size={24} color="gray" />
            <Text className="text-lg text-gray-800 text-right">
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </>
  );

  return (
    <DrawerContentScrollView className="flex-1 bg-white p-4 items-end">
      {renderSection("חשבון", sections.account)}
      {renderSection("פעולות", sections.menu)}
      <Pressable onPress={() => signOut()}  className="p-3 rounded-lg hover:bg-gray-200 mt-2 w-full border-b border-gray-200">
        <View className="flex-row-reverse items-center gap-4 p-2 mr-4">
          <Ionicons name="log-out" size={24} color="gray" />
          <Text className="text-lg text-red-600 text-right">התנתק</Text>
        </View>
      </Pressable>
    </DrawerContentScrollView>
  );
}
