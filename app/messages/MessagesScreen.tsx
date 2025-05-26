import { SafeAreaView, View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { subscribeToMessages, Message } from "@/services/messages";
import { useRolesContext } from "@/hooks/RolesContext";
import MessagesHeader from "./MessagesHeader";

export default function MessagesScreen() {
  const { roles, rolesLoading } = useRolesContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((fetchedMessages, error) => {
      if (error) {
        console.error("שגיאה בטעינת הודעות:", error);
        setLoadingMessages(false);
        return;
      }
      setMessages(fetchedMessages || []);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, []);

  if (rolesLoading || loadingMessages) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  const getVisibleMessages = () => {
    if (roles.includes("Admin")) {
      return messages; // Admin sees all messages
    } else if (roles.includes("Dispatcher")) {
      return messages.filter(
        (msg) =>
          msg.distribution_by_role === "All" ||
          msg.distribution_by_role === "Dispatcher"
      );
    } else if (roles.includes("Volunteers")) {
      return messages.filter(
        (msg) =>
          msg.distribution_by_role === "All" ||
          msg.distribution_by_role === "Volunteers"
      );
    }
  };

  const visibleMessages = getVisibleMessages()?.reverse() || [];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      {visibleMessages.length === 0 ? (
        <Text className="text-center text-blue-700 text-lg mt-8">
          אין הודעות להצגה
        </Text>
      ) : (
        visibleMessages.map((msg) => (
          <View
            key={msg.message_id}
            className="mb-6 bg-blue-50 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-end"
          >
            <View className="flex flex-row items-center justify-between w-full mb-2">
              <Text className="text-right text-sm text-gray-500 mb-1">
                {msg.date} {msg.time}
              </Text>

              <Text className="text-right text-sm font-bold text-gray-800 mb-2">
                {msg.distribution_by_role === "All"
                  ? "[כולם]"
                  : msg.distribution_by_role === "Dispatcher"
                  ? "[מוקדן]"
                  : msg.distribution_by_role === "Admin"
                  ? "[מנהל]"
                  : null}
              </Text>
            </View>

            <Text className="text-right text-gray-800 leading-relaxed">
              {msg.message_description}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
