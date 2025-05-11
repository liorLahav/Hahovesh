import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // אייקונים של expo
import { useRolesContext } from "@/services/RolesContext";
import { useEffect, useState } from "react";
import { getEvents } from "@/services/events"; // פונקציה שמביאה את האירועים מהשרת

export default function ActiveEvents() {
  type Event = {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    anamnesis: string;
    street: string;
  };

  const { roles, loading } = useRolesContext();
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response);
        console.log("Fetched events:", response); // Debugging

        setEvents(response);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [events]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="items-center justify-center bg-blue-600 py-5 rounded-b-2xl shadow-md">
        <Text className="text-3xl font-bold text-white tracking-widest">
          אירועים פעילים
        </Text>

        <View className="w-16 h-1 bg-white mt-2 rounded-full" />

        {roles.includes("Dispatcher") || roles.includes("Admin") ? (
          <Pressable
            className="absolute  right-1 bg-red-600 px-3 rounded-full flex-row items-center shadow-2xl w-[100px] h-[50px] justify-center mr-1"
            onPress={() => console.log("אירוע חדש נלחץ")}
          >
            <Text className="text-white text-lg font-bold">אירוע חדש</Text>
          </Pressable>
        ) : null}
      </View>

      {/* ScrollView עם Cards */}
      <ScrollView contentContainerStyle={{ padding: 6, paddingBottom: 100 }}>
        <View className="">
          {events.length === 0 ? (
            <Text className="text-center text-lg text-blue-700">
              לא נמצאו אירועים פעילים
            </Text>
          ) : (
            Object.values(events).map((event, index) => (
              <View
                key={event["createdAt"]}
                className="bg-white rounded-xl shadow-md mb-4 border border-blue-300 p-4"
              >
                <Text className="text-xl font-bold text-blue-800 mb-2 text-right">
                  {event.anamnesis}
                </Text>
                <Text className="text-base text-gray-700 mb-4 text-right">
                  {event.street}
                </Text>

                <View className="flex-row justify-between">
                  <Pressable className="bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-semibold">
                      פרטים נוספים
                    </Text>
                  </Pressable>

                  <Pressable className="bg-red-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-semibold">קבל אירוע</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
