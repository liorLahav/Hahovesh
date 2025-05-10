import { Drawer } from "expo-router/drawer";
import DrawerContent from "./home/DrawerContent";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import "../global.css";
import { View, Text } from "react-native";
import { useRoles } from "@/hooks/useRoles";

export default function RootLayout() {
  const userId = "Sy79iRZBzqaUey6elxmT";
  const {roles, loading} = useRoles(userId);


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} userRole={roles ?? []} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        // drawerStyle: { backgroundColor: "#3498db" },
      }}
    >
      <Drawer.Screen name="index" options={{ title: "בית" }} />
      <Drawer.Screen name="home/profile" options={{ title: "פרופיל" }} />
    </Drawer>
  );
}
