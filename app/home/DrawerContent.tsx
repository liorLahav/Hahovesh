import { DrawerContentScrollView } from "@react-navigation/drawer";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DrawerContent(
  props: DrawerContentComponentProps & { userRole: string[] }
) {
  const router = useRouter();
  let userRole = 0;
  if (props.userRole.includes("Admin")) {
    userRole = 2;
  } else if (props.userRole.includes("Dispatcher")) {
    userRole = 1;
  }

  userRole = 0; // Debugging 

  return (
    <DrawerContentScrollView
      {...props}
      className="flex-1 bg-white p-4 items-end"
    >
      <Text className="w-full text-right mb-2 text-xl border-b border-gray-500 px-2 py-4">
        חשבון
      </Text>
      {accountItems
        .filter((item) => userRole >= item.minRole)
        .map((item) => (
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
      <Text className="w-full text-right mb-2 text-xl border-b border-gray-500 px-2 py-4">
        פעולות
      </Text>
      {menuItems
        .filter((item) => userRole >= item.minRole)
        .map((item) => (
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

      <Pressable className="p-3 rounded-lg hover:bg-gray-200 mt-2 w-full border-b border-gray-200">
        <View className="flex-row-reverse items-center gap-4 p-2 mr-4">
          <Ionicons name="log-out" size={24} color="gray" />
          <Text className="text-lg text-red-600 text-right">התנתק</Text>
        </View>
      </Pressable>
    </DrawerContentScrollView>
  );
}

const accountItems = [
  { label: "דף הבית", icon: "home", route: "index", minRole: 0 },
  { label: "פרופיל", icon: "person", route: "home/profile", minRole: 0 },
];

const menuItems = [
  { label: "הודעות", icon: "chatbubbles", route: "messages", minRole: 0 },
  { label: "אירועים פעילים", icon: "calendar", route: "events", minRole: 0 },
  {
    label: "סטטיסטיקה אישית",
    icon: "stats-chart",
    route: "personalStats",
    minRole: 0,
  },
  {
    label: "צפייה בכל הסטטיסטיקות",
    icon: "analytics",
    route: "allStats",
    minRole: 2,
  },
  {
    label: "צפייה בדוחות סיכום",
    icon: "document-text",
    route: "summaryReports",
    minRole: 2,
  },
  {
    label: "ניהול כוננים",
    icon: "people",
    route: "volunteerManagement",
    minRole: 2,
  },
];
