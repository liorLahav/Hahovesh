import HomePageHeader from "./HomePageHeader";
import UserStatus from "./userStatus";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveEvents from "./ActiveEvents";
import { useEffect, useState } from "react";
import { subscribeToMessages, Message } from "@/services/messages";
import { useRolesContext } from "@/hooks/RolesContext";
import { useMessages } from "@/hooks/MessagesContext";

export default function HomePage() {
  const userId = "Sy79iRZBzqaUey6elxmT";
  const { roles, rolesLoading } = useRolesContext();
  const {messages} = useMessages();

  return (

    <SafeAreaView className="flex-1 bg-blue-200">
      <HomePageHeader userId={userId} messages={messages} userRoles={roles} />
      <UserStatus userId="Sy79iRZBzqaUey6elxmT" />
      <ActiveEvents userId="Sy79iRZBzqaUey6elxmT" />
    </SafeAreaView>
  );
}
