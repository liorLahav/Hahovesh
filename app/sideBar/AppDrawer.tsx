/**
 * @file AppDrawer.tsx
 * @description This file defines the AppDrawer component, which is a custom drawer navigator for the application.
 * It uses the Expo Router's Drawer component to create a side menu for navigation.
 * The drawer content is customized using the DrawerContent component, which is passed the user's role.
 */

import { Drawer } from "expo-router/drawer";
import DrawerContent from "./DrawerContent";
import { View, Text } from "react-native";
import { useUserContext } from "@/hooks/UserContext";

export default function AppDrawer() {
  const {user, userLoading} = useUserContext();

  if (userLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => (
        <DrawerContent {...props} userRole={user.permissions ?? []} />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
      }}
    ></Drawer>
  );
}
