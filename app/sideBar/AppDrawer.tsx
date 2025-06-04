/**
 * @file AppDrawer.tsx
 * @description Custom drawer navigator that locks itself while an event is active.
 */

import React, { useEffect } from "react";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import DrawerContent from "./DrawerContent";
import { View, Text } from "react-native";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";

export default function AppDrawer() {
  const {user, userLoading} = useUserContext();

  if (userLoading) {
    return (
      <Loading message="טוען פרטי משתמש..." />
    );
  }

  return (
    <Drawer
      /* תוכן המגירה המותאם */
      drawerContent={(props) => (
        <DrawerContent {...props} userRole={user.permissions ?? []} />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        swipeEnabled: !isEventActive,    
      }}
    />
  );
}
