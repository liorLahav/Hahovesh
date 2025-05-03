import { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "../components/Button";
import HomePageHeader from "./home/HomePageHeader";
import HomePage from "./home/HomePage";

export default function App() {
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <HomePage />
  );
}
