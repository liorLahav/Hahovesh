import "global.css";
import { Slot, useRouter } from "expo-router";
import { UserProvider } from "@/hooks/UserContext";
import { OnlineProvider } from "@/hooks/OnlineContext";
import { EventProvider } from "@/hooks/EventContext";
import { MessagesProvider } from "@/hooks/MessagesContext";
import { useFonts } from "expo-font";
import { Text } from "react-native";
import Loading from "@/components/Loading";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/toastConfig";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Assistant: require("../assets/fonts/Assistant-Regular.ttf"),
    "Assistant-Bold": require("../assets/fonts/Assistant-Bold.ttf"),
  });

  if (!fontsLoaded) return <Text>Loading fonts...</Text>; // או קומפוננטת Loading

  return (
    <UserProvider>
      <OnlineProvider>
        <EventProvider>
          <MessagesProvider>
            <Slot />
            <Toast config={toastConfig} />
          </MessagesProvider>
        </EventProvider>
      </OnlineProvider>
    </UserProvider>
  );
}
