
import { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";

export default function AuthLayout() {
  const { isAuthenticated, userLoading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    console.log("Is authenticated:", isAuthenticated);
    if (!userLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, userLoading]);

  if (userLoading) return <Loading message="Checking authentication..." />;

  return <Slot />;
}
