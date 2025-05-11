import { Button } from "@/components/Button";
import HomePageHeader from "./HomePageHeader";
import UserStatus from "./userStatus";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveEvents from "./ActiveEvents";
import { useEffect } from "react";

export default function HomePage() {
  const userId = "Sy79iRZBzqaUey6elxmT";
  return (
    <SafeAreaView className="flex-1 bg-blue-200">
      <HomePageHeader />
      <UserStatus userId="Sy79iRZBzqaUey6elxmT" />
      <ActiveEvents />
    </SafeAreaView>
  );
}
