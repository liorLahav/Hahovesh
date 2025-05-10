import { Drawer } from "expo-router/drawer";
import DrawerContent from "./home/DrawerContent";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import "../global.css";
import { View, Text } from "react-native";
import { RolesProvider, } from "@/services/RolesContext";
import AppDrawer from "./AppDrawer";

export default function RootLayout() {
  return (
    <RolesProvider>
      <AppDrawer />
    </RolesProvider>
  );
}
