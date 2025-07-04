import { DrawerContentScrollView } from "@react-navigation/drawer";
import { SafeAreaView, View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {drawerItems} from "../../../data/DrawerRoutes";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useUserContext } from "@/hooks/UserContext";
import { removeExpoToken, updateExpoToken } from "@/services/users";
import tw from "twrnc";

export default function DrawerContent(
  props: DrawerContentComponentProps & { userRole: string[] }
) {
  const router = useRouter();
  const {user, signOut} = useUserContext();
  let roleLevel = 0;
  if (props.userRole.includes("Admin")) roleLevel = 2;
  else if (props.userRole.includes("Dispatcher")) roleLevel = 1;

  const filteredItems = drawerItems.filter((item) => roleLevel >= item.minRole);

  const sections = {
    account: filteredItems.filter((i) => i.section === "account"),
    menu: filteredItems.filter((i) => i.section === "menu"),
  };
  const signOutFunc = () => {
    // Implement sign out logic here
    Alert.alert("התנתקות", "האם אתה בטוח שברצונך להתנתק?", [
      {
        text: "לא",
        style: "cancel",
      },
      {
        text: "כן",
        onPress: () => {
          let expoToken = user?.expoPushToken;
          let id = user?.id;
          try {
            removeExpoToken(user.id);
          } catch (error) {
            console.error("Error removing Expo token:", error);
          }
          try {
            signOut();
          } catch (error) {
            updateExpoToken(id,expoToken);
            console.error("Error removing Expo token:", error);
          }
        },
      },
    ]);
  }

  const renderSection = (title: string, items: typeof filteredItems) => (
    <>
      <Text style={tw`w-full text-right mb-2 text-xl border-b border-gray-500 px-2 py-4`}>
        {title}
      </Text>
      {items.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => router.push(("/" + item.route) as any)}
          style={tw`p-3 rounded-lg hover:bg-gray-200 mt-2 w-full border-b border-gray-200`}
        >
          <View style={tw`flex-row-reverse items-center gap-4 p-2 mr-4`}>
            <Ionicons name={item.icon as any} size={24} color="gray" />
            <Text style={tw`text-lg text-gray-800 text-right`}>
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </>
  );

  return (
    <DrawerContentScrollView style={tw`flex-1 bg-white p-4`}
      contentContainerStyle={tw`items-end`}>
      {renderSection("חשבון", sections.account)}
      {renderSection("פעולות", sections.menu)}
      <Pressable onPress={() => signOutFunc()}  style={tw`p-3 rounded-lg hover:bg-gray-200 mt-2 w-full border-b border-gray-200`}>
        <View style={tw`flex-row-reverse items-center gap-4 p-2 mr-4`}>
          <Ionicons name="log-out" size={24} color="gray" />
          <Text style={tw`text-lg text-red-600 text-right`}>התנתק</Text>
        </View>
      </Pressable>
    </DrawerContentScrollView>
  );
}
