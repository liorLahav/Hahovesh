import { SafeAreaView, View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { Message } from "@/services/messages";

export default function DeleteMessage(message: Message, role: string) {
  const [messageDeleted, setMessageDeleted] = useState(false);

  useEffect(() => {
    const deleteMessage = async () => {}
  }, []);


}
