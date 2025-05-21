import { View } from "react-native";
import MessagesHeader from "./MessagesHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import MessagesForm from "./MessagesForm";

export default function MessagesPage() {
  return (
    <SafeAreaView>
      <MessagesHeader />
      
    </SafeAreaView>
  );
}
