import { View } from "react-native";
import MessagesHeader from "./MessagesHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessagesScreen() {
  return (
    <SafeAreaView>
      <MessagesHeader />
      {/* תוכן נוסף */}
    </SafeAreaView>
  );
}
