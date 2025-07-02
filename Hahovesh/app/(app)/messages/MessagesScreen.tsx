import { View, Text, ScrollView } from "react-native";
import { useEffect } from "react";
import { markMessagesAsRead } from "@/services/messages";
import { useMessages } from "@/hooks/MessagesContext";
import { StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import DeleteMessageButton from "./DeleteMessageButton";
import DeleteAllMessagesButton from "./DeleteAllMessagesButton";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";
import tw from 'twrnc';

export default function MessagesScreen() {
  const { user, userLoading } = useUserContext();
  const { messages, loadingMessages } = useMessages();
  const isFocused = useIsFocused();
  const userId = user.id;
  const roles = user.permissions || [];

  useEffect(() => {
    if (isFocused && messages && user) {
      markMessagesAsRead(user.id, messages, user.permissions);
    }
  }, [isFocused, user, messages]);

  if (userLoading || loadingMessages) {
    return <Loading />;
  }

  const getVisibleMessages = () => {
    if (roles.includes("Admin")) {
      return messages;
    } else if (roles.includes("Dispatcher")) {
      return messages.filter(
        (msg) =>
          msg.distribution_by_role === "All" ||
          msg.distribution_by_role === "Dispatcher" ||
          msg.distribution_by_role === "Volunteers"
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 80 }}>
        {visibleMessages.length === 0 ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <Text style={tw`text-black text-[20px]`}>אין הודעות להצגה</Text>
          </View>
        ) : (
          visibleMessages.reverse().map((msg) => (
            <View
              key={msg.message_id}
              style={tw`mb-6 bg-blue-50 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col`}
            >
              <View
                style={tw`${roles.includes("Admin") ? "flex-row items-center justify-between mb-2" : "flex justify-between mb-1"}`}
              >
                {roles.includes("Admin") && (
                  <DeleteMessageButton msgId={msg.message_id} />
                )}

                <Text style={tw`text-right text-[13px] text-gray-500 mb-1`}>
                  {msg.date} {msg.time}
                </Text>
              </View>

              <Text style={tw`text-right text-[13px] font-bold text-gray-800 mb-4`}>
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

              <Text style={tw`text-right text-gray-800 leading-relaxed`}>
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
