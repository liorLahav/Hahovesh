/**
 * @fileoverview This file is the root layout for the application.
 * It wraps the entire application in a context provider for user roles and includes the AppDrawer component.
 * need to include common components
 */

import "../global.css";
import { useEffect } from "react";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

import { EventProvider } from "@/hooks/EventContext";
import { OnlineProvider } from "@/hooks/OnlineContext";
import AppDrawer from "./sideBar/AppDrawer";
import { MessagesProvider } from "@/hooks/MessagesContext";
import { UserContext, UserProvider } from "@/hooks/UserContext";

export default function RootLayout() {
  const router = useRouter();

  return (
    <UserProvider>
      <OnlineProvider>
          <EventProvider>
            <MessagesProvider>
              <AppDrawer />
            </MessagesProvider>
          </EventProvider>
      </OnlineProvider>
    </UserProvider>
  );
}
