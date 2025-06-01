import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import {
  deleteMessage,
  markMessagesAsRead,
  Message,
} from "@/services/messages";
import { useRolesContext } from "@/hooks/RolesContext";
import { useMessages } from "@/hooks/MessagesContext";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MessagesScreen() {
  const { roles, rolesLoading } = useRolesContext();
  const { messages, loadingMessages } = useMessages();
  const userId = "abc";

  const handleDeleteMessage = async (msgId: string) => {
    try {
      await deleteMessage(msgId);
    } catch (err) {
      console.error("שגיאה במחיקת הודעה:", err);
    }
  };

  useEffect(() => {
    if (messages.length && userId) {
      markMessagesAsRead(userId, messages, roles);
    }
  }, [userId, messages]);

  if (rolesLoading || loadingMessages) {
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
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {visibleMessages.length === 0 ? (
          <Text className="text-center text-blue-700 text-lg mt-8">
            אין הודעות להצגה
          </Text>
        ) : (
          visibleMessages.reverse().map((msg) => (
            <View
              key={msg.message_id}
              className="mb-6 bg-blue-50 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col "
            >
              <View className="flex flex-row justify-between items-center mb-1">
                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "האם אתה בטוח?",
                      "לאחר המחיקה לא תוכל לשחזר הודעה",
                      [
                        {
                          text: "ביטול",
                          style: "cancel",
                        },
                        {
                          text: "אישור",
                          onPress: () => handleDeleteMessage(msg.message_id),
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="trash-outline" size={22} color="red" />
                </Pressable>

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
      </ScrollView>
    </>
  );
}
