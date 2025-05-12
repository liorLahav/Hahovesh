import HomePageHeader from "./HomePageHeader";
import UserStatus from "./userStatus";
import { SafeAreaView } from "react-native-safe-area-context";
import ActiveEvents from "./ActiveEvents";

// This component is the main page of the app.
// It includes the header, user status, active events, notification icon, drawer.

export default function HomePage() {
  {
    /* userId should be dynamic (need the firebase auth) */
  }
  const userId = "Sy79iRZBzqaUey6elxmT";
  return (
    <SafeAreaView className="flex-1 bg-blue-200">
      <HomePageHeader />
      <UserStatus userId="Sy79iRZBzqaUey6elxmT" />
      <ActiveEvents />
    </SafeAreaView>
  );
}
