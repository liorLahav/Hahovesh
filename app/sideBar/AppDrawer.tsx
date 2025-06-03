/**
 * @file AppDrawer.tsx
 * @description Custom drawer navigator that locks itself while an event is active.
 */

import React, { useEffect } from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import DrawerContent from "./DrawerContent";
import { View, Text } from "react-native";
import { useRolesContext } from "@/hooks/RolesContext";
import { useEventContext } from "@/hooks/EventContext";

export default function AppDrawer() {
  const { roles, rolesLoading } = useRolesContext();
  const { isEventActive } = useEventContext();

  if (rolesLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <Drawer
      /* תוכן המגירה המותאם */
      drawerContent={(props) => (
        <DrawerContent {...props} userRole={roles ?? []} />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        swipeEnabled: !isEventActive,    
      }}
    />
  );
}
