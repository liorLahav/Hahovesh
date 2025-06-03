import { Text } from "react-native";
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import HomePage from "./home";
import Register from "./Register";

export default function App() {
  const [fontsLoaded] = useFonts({
    Assistant: require("../assets/fonts/Assistant-Regular.ttf"),
    "Assistant-Bold": require("../assets/fonts/Assistant-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>טוען...</Text>;
  }

  return <HomePage />;
}
