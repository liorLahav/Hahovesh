// App.js
import { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "../components/Button";
import HomePageHeader from "./home/HomePageHeader";
import { Stack } from "expo-router";
import HomePage from "./home/HomePage";
export default function App() {
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomePage />
    </>
    // <View className="flex-1 items-center justify-center gap-4">
    //   <Text className="text-3xl font-bold mb-4">
    //     NativeWind work
    //   </Text>
    //   <Button
    //     labelClasses="text-pink-400"
    //     label={"Tap if Omer gay"}
    //     onPress={() => {
    //       setCount((c) => c + 1);
    //       setClicked(true);
    //     }}
    //     variant="default"
    //     size="default"
    //   />
    //   <Text className="text-3xl font-bold mb-4 text-pink-400">{count}</Text>
    // </View>
  );
}
