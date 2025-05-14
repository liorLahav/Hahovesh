/**
 * @fileoverview This file is the root layout for the application.
 * It wraps the entire application in a context provider for user roles and includes the AppDrawer component.
 * need to include common components
 */ 

import "../global.css";
import { RolesProvider } from "@/hooks/RolesContext";
import AppDrawer from "./sideBar/AppDrawer";

export default function RootLayout() {
  return (
    <RolesProvider>
      <AppDrawer />
    </RolesProvider>
  );
}
