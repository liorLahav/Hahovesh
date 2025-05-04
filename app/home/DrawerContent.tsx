import { DrawerContentScrollView } from "@react-navigation/drawer";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

export default function DrawerContent(
  props: DrawerContentComponentProps & { userRole: string[] }
) {
  const roleNumbers: number[] = [];

  if (props.userRole.includes("Volunteer")) {
    roleNumbers.push(0);
  }
  if (props.userRole.includes("Dispatcher")) {
    roleNumbers.push(1);
  }
  if (props.userRole.includes("Admin")) {
    roleNumbers.push(2);
  }

  let userRole: number = -1;
  for (let i = 0; i < roleNumbers.length; i++) {
    userRole = roleNumbers[i];
  }
  userRole = 1; // default to -1 if no roles are found

  if (userRole === -1) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-800">
          אין הרשאות - פנה למנהל מערכת
        </Text>
      </View>
    );
  }

  // debugging
  console.log("highest role", userRole);
  return (
      <DrawerContentScrollView
        {...props}
        className="flex-1 bg-white p-4 items-end"
      >
        {userRole >= 0 && (
          <>
            <Text className="w-full text-right mb-2 text-xl border-b border-gray-300 px-2 py-4">
              פעולות
            </Text>

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
              onPress={() => props.navigation.navigate("home/profile")}
              className="p-3 rounded-lg hover:bg-gray-200 mt-2 w-full"
            >
              <Text className="text-lg text-gray-800 text-right">פרופיל</Text>
            </Pressable>
          </>
        )}

        <Pressable
          onPress={() => console.log("התנתקות")}
          className="p-3 rounded-lg hover:bg-red-100 mt-12 w-full"
        >
          <Text className="text-lg text-red-600 text-right">התנתק</Text>
        </Pressable>
      </DrawerContentScrollView>
  );
}
