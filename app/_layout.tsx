import "../global.css";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

import { EventProvider } from "@/hooks/EventContext";
import { OnlineProvider } from "@/hooks/OnlineContext";
import AppDrawer from "./sideBar/AppDrawer";
import { MessagesProvider } from "@/hooks/MessagesContext";
import { UserProvider, useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";

function AppContent() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, userLoading } = useUserContext();

  // useEffect(() => {
  //   if (userLoading) return;

  //   const inAuthGroup = segments[0] === "Login";
  //   console.log("Current segments:", segments);
  //   console.log("isAuthenticated:", isAuthenticated);

  //   if (!isAuthenticated && !inAuthGroup) {
  //     console.log("User is not authenticated, redirecting to Login");
  //     router.replace("/Login");
  //   }

  //   if (isAuthenticated && inAuthGroup) {
  //     console.log("User is authenticated, redirecting to Home");
  //     router.replace("/home");
  //   }
  // }, [segments, isAuthenticated, userLoading]);

  //if (userLoading) return <Loading message="טוען פרטי משתמש..." />;

  return (
    <OnlineProvider>
      <EventProvider>
        <MessagesProvider>
          <AppDrawer />
        </MessagesProvider>
      </EventProvider>
    </OnlineProvider>
  );
}

export default function RootLayout() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
