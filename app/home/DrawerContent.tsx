import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Text, Pressable } from "react-native";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

export default function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      className="flex-1 bg-white p-4 items-end"
    >
      <Text className="w-full text-right mb-2 text-xl border-b border-gray-300 px-2 py-4">פעולות</Text>

      <Pressable
        onPress={() => {
          console.log("נלחץ כפתור דף הבית");
          props.navigation.navigate("index");
        }}
        className="p-3 rounded-lg hover:bg-gray-200 mt-2 w-full"
      >
        <Text className="text-lg text-gray-800 text-right">דף הבית</Text>
      </Pressable>

      <Pressable
        onPress={() => props.navigation.navigate("profile")}
        className="p-3 rounded-lg hover:bg-gray-200 mt-2 w-full"
      >
        <Text className="text-lg text-gray-800 text-right">פרופיל</Text>
      </Pressable>

      <Pressable
        onPress={() => console.log("התנתקות")}
        className="p-3 rounded-lg hover:bg-red-100 mt-2 w-full"
      >
        <Text className="text-lg text-red-600 text-right">התנתק</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}
