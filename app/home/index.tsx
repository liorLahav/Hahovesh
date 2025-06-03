import HomePageHeader from "./HomePageHeader";
import UserStatus from "./userStatus";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveEvents from "./ActiveEvents";
import { useEffect, useState } from "react";
import { subscribeToMessages, Message } from "@/services/messages";
import { useMessages } from "@/hooks/MessagesContext";

export default function HomePage() {
  const userId = "Sy79iRZBzqaUey6elxmT";
  const {messages} = useMessages();

  return (

    <SafeAreaView className="flex-1 bg-blue-200">
      <HomePageHeader messages={messages}/>
      <UserStatus />
      <ActiveEvents />
    </SafeAreaView>
  );
}
