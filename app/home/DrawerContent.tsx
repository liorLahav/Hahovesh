import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Text, Pressable } from "react-native";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

export default function DrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      className="flex-1 bg-white p-4 items-end"
    >
      <Text className=" w-full">פעולות</Text>
      <Pressable
        onPress={() => {
          console.log("נלחץ כפתור דף הבית");
          props.navigation.navigate("index");
        }}
        className="p-3 rounded-lg hover:bg-gray-200"
      >
        <Text className="text-lg text-gray-800">דף הבית</Text>
      </Pressable>

      <Pressable
        onPress={() => props.navigation.navigate("profile")}
        className="p-3 rounded-lg hover:bg-gray-200 mt-2"
      >
        <Text className="text-lg text-gray-800">פרופיל</Text>
      </Pressable>

      <Pressable
        onPress={() => console.log("התנתקות")}
        className="p-3 rounded-lg hover:bg-red-100 mt-2"
      >
        <Text className="text-lg text-red-600">התנתק</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}
