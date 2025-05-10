// app/AppDrawer.tsx
import { Drawer } from "expo-router/drawer";
import DrawerContent from "./home/DrawerContent";
import { View, Text } from "react-native";
import { useRolesContext } from "@/services/RolesContext";

export default function AppDrawer() {
  const { roles, loading } = useRolesContext();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => (
        <DrawerContent {...props} userRole={roles ?? []} />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen name="index" options={{ title: "בית" }} />
      <Drawer.Screen name="home/profile" options={{ title: "פרופיל" }} />
    </Drawer>
  );
}
