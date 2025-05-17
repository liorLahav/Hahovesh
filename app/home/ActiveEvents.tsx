import { View, Text, ScrollView, Pressable } from "react-native";
import { useRolesContext } from "@/hooks/RolesContext";
import { useEffect, useState } from "react";
import { subscribeToEvents } from "@/services/events";
import { router } from "expo-router";

export default function ActiveEvents() {
  type Event = {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    anamnesis: string;
    street: string;
  };

  const { roles, rolesLoading } = useRolesContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((fetchedEvents, error) => {
  if (error) {
    console.error("שגיאה בשליפת אירועים:", error);
    setLoadingEvents(false);
    return;
  }

  if (fetchedEvents) {
    setEvents(fetchedEvents);
  } else {
    setEvents([]); 
  }

  setLoadingEvents(false);
});


    return () => unsubscribe();
  }, []);

  if (rolesLoading || loadingEvents) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text className="text-3xl font-bold text-white tracking-wide">
          אירועים פעילים
        </Text>

        <View className="w-16 h-1 bg-white mt-2 rounded-full" />

        {roles.includes("Dispatcher") || roles.includes("Admin") ? (
          <Pressable
            className="absolute right-3 top-5 bg-red-600 px-4 py-3 rounded-full shadow-md h-[40px]"
            onPress={() => router.push("/newEvent/NewEvent")}
          >
            <Text className="text-white font-bold text-base">אירוע חדש</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 100 }}>
        {events.length === 0 ? (
          <Text className="text-center text-lg text-blue-700 mt-8">
            לא נמצאו אירועים פעילים
          </Text>
        ) : (
          events.map((event) => (
            <View
              key={event.id}
              className="bg-blue-50 border border-blue-300 rounded-xl shadow-sm mb-4 p-4"
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

                <Pressable
                  className="bg-red-600 px-4 py-2 rounded-lg"
                  onPress={() => console.log("קבל אירוע נלחץ")}
                >
                  <Text className="text-white font-semibold">קבל אירוע</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
