import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useEffect } from "react";
import {
  deleteAllMessages,
  deleteMessage,
  markMessagesAsRead,
} from "@/services/messages";
import { useMessages } from "@/hooks/MessagesContext";
import { StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import DeleteMessageButton from "./DeleteMessageButton";
import DeleteAllMessagesButton from "./DeleteAllMessagesButton";
import { useUserContext } from "@/hooks/UserContext";
export default function MessagesScreen() {
  const {user, userLoading} = useUserContext();

  const { messages, loadingMessages } = useMessages();
  const isFocused = useIsFocused();
  const userId = "Sy79iRZBzqaUey6elxmT";
  const roles = user.permissions || [];

  useEffect(() => {
    if (isFocused && messages.length && userId) {
      markMessagesAsRead(userId, messages, roles);
    }
  }, [isFocused, userId, messages]);

  if (userLoading || loadingMessages) {
    return (
      <View className="flex-1 items-center justify-center text-bold text-lg">
        <Text>טוען...</Text>
      </View>
    );
  }

  const getVisibleMessages = () => {
    if (roles.includes("Admin")) {
      return messages;
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

  const visibleMessages = getVisibleMessages() || [];

  return (
    <>
      <StatusBar backgroundColor="black" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 80 }}
      >
        {visibleMessages.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className=" text-black text-2xl text-blur ">
              אין הודעות להצגה
            </Text>
          </View>
        ) : (
          visibleMessages.reverse().map((msg) => (
            <View
              key={msg.message_id}
              className="mb-6 bg-blue-50 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col "
            >
              <View
                className={`flex justify-between mb-1 ${
                  roles.includes("Admin") ? "flex-row items-center" : null
                }`}
              >
                {roles.includes("Admin") && (
                  <DeleteMessageButton msgId={msg.message_id} />
                )}

                <Text className="text-right text-sm text-gray-500 mb-1">
                  {msg.date} {msg.time}
                </Text>
              </View>

              <Text className="text-right text-sm font-bold text-gray-800 mb-2">
                {msg.distribution_by_role === "All"
                  ? "[כולם]"
                  : msg.distribution_by_role === "Dispatcher"
                  ? "[מוקדן]"
                  : msg.distribution_by_role === "Admin"
                  ? "[מנהל]"
                  : msg.distribution_by_role === "Volunteers"
                  ? "[חובשים]"
                  : null}
              </Text>

              <Text className="text-right text-gray-800 leading-relaxed">
                {msg.message_description}
              </Text>
            </View>
          ))
        )}

        {messages.length >= 2 && roles.includes("Admin") && (
          <DeleteAllMessagesButton />
        )}
      </ScrollView>
    </>
  );
}
