/**
 * @fileoverview This file is the root layout for the application.
 * It wraps the entire application in a context provider for user roles
 * and includes the AppDrawer component. It also handles passwordless
 * Firebase sign-in via email magic links.
 */

import "../global.css";
import { useEffect } from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

import { RolesProvider } from "@/hooks/RolesContext";
import { EventProvider } from "@/hooks/EventContext";
import { OnlineProvider } from "@/hooks/OnlineContext";
import AppDrawer from "./sideBar/AppDrawer";
import User from "./UserManagement/User";
import { UserProvider } from "@/hooks/UserContext";

export default function RootLayout() {
  const router = useRouter();

  return (
    <UserProvider>
    <OnlineProvider>
      <RolesProvider>
        <EventProvider>
          <AppDrawer />
        </EventProvider>
      </RolesProvider>
    </OnlineProvider>
    </UserProvider>
  );
}
