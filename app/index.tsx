import { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "../components/Button";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../FirebaseConfig"; // Adjust the import path as necessary
import UserManegmentScreen from "./UserManagement";

export default function App() {
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState('');


  return (
      <View className="flex-1 items-center justify-center gap-4">
        <UserManegmentScreen />
      </View>
  );
}
