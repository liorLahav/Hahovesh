import React, { ReactNode } from "react";
import { Drawer } from "expo-router/drawer";
import DrawerContent from "./DrawerContent";
import { useUserContext } from "@/hooks/UserContext";
import { useEventContext } from "@/hooks/EventContext";
import Loading from "@/components/Loading";

export default function AppDrawer({ children }: { children: ReactNode }) {
  const { user, userLoading } = useUserContext();
  const { isEventActive } = useEventContext();

  if (userLoading) {
    return <Loading message="טוען פרטי משתמש..." />;
  }

  return (
    <Drawer
      drawerContent={(props) => (
        <DrawerContent {...props} userRole={user?.permissions ?? []} />
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        swipeEnabled: !isEventActive,
      }}
    >
      {children}
    </Drawer>
  );
}
