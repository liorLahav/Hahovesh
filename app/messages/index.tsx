import { View } from "react-native";
import MessagesHeader from "./MessagesHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import MessagesForm from "./MessagesForm";
import MessagesScreen from "./MessagesScreen";

export default function MessagesPage() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <MessagesHeader />

      <MessagesScreen />
    </SafeAreaView>
  );
}
