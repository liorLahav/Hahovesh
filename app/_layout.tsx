/**
 * @fileoverview This file is the root layout for the application.
 * It wraps the entire application in a context provider for user roles and includes the AppDrawer component.
 * need to include common components
 */

import "../global.css";
import { RolesProvider } from "@/hooks/RolesContext";
import { EventProvider } from "@/hooks/EventContext";
import { OnlineProvider } from "@/hooks/OnlineContext";
import AppDrawer from "./sideBar/AppDrawer";
import { MessagesProvider } from "@/hooks/MessagesContext";

export default function RootLayout() {
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
