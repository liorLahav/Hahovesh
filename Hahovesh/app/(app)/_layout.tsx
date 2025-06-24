
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";
import AppDrawer from "./sideBar/AppDrawer";

export default function AppLayout() {
  const { isAuthenticated, userLoading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    console.log("Checking authentication state in layout...");
    if (!userLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, userLoading]);

  if (userLoading) return <Loading message="Loading user..." />;

  return (
    <AppDrawer>
      <Slot />
    </AppDrawer>
  );
}
