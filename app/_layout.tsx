/**
 * @fileoverview This file is the root layout for the application.
<<<<<<< HEAD
 * It wraps the entire application in a context provider for user roles
 * and includes the AppDrawer component. It also handles passwordless
 * Firebase sign-in via email magic links.
=======
 * It wraps the entire application in a context provider for user roles and includes the AppDrawer component.
 * need to include common components
>>>>>>> 3a7999ffb6cd39784d9893e5c9006d4bbb8fea10
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
import { MessagesProvider } from "@/hooks/MessagesContext";

export default function RootLayout() {
  const router = useRouter();

  return (
    <OnlineProvider>
      <RolesProvider>
        <EventProvider>
          <MessagesProvider>
            <AppDrawer />
          </MessagesProvider>
        </EventProvider>
      </RolesProvider>
    </OnlineProvider>
  );
}
