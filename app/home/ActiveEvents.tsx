import { View, Text, ScrollView, Pressable } from "react-native";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import { subscribeToEvents, Event, addVolunteerToEvent } from "@/services/events";
import { updateUserStatus } from "@/services/users";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEventContext } from "@/hooks/EventContext";
import { useOnlineContext } from "@/hooks/OnlineContext";
import { useUserContext } from "@/hooks/UserContext";



export default function ActiveEvents() {
  const { user, userLoading } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const unsubscribeRef = useRef<() => void | null>(null);
  const { event, isEventActive, changeEvent } = useEventContext();
  const { isOnline } = useOnlineContext();
  const roles = user.permissions || [];

  const receiveEvent = (event: Event) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    console.log("Changing user status to Arriving for event ID:", event.id);
    updateUserStatus(user.id, "Arriving : " + event.id)
      .then(() => {
        console.log("User status updated successfully");
        addVolunteerToEvent(event.id, user.id)
          .then(() => {
            console.log("Volunteer added to event successfully");
          })
      })
      .catch((error) => {
        console.error("Error updating user status:", error);
      });

    changeEvent(event);
  };



  // Subscribe only once when component mounts
  useEffect(() => {
    setLoadingEvents(true);
    console.log("isEventActive:", isEventActive);
    if (!isEventActive) {
      console.log("Subscribing to events...");
      const unsubscribeFunction = subscribeToEvents((fetchedEvents, error) => {
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

      // Store the unsubscribe function in a ref for access elsewhere
      unsubscribeRef.current = unsubscribeFunction;

      // Clean up subscription when component unmounts
      return () => {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    }
  }, [isEventActive]); // only subscribe when isEventActive false

  if (userLoading || loadingEvents) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text
          className="text-3xl text-white tracking-wide"
          style={{ fontFamily: "Assistant-Bold" }}
        >
          אירועים פעילים
        </Text>

        <View className="w-16 h-1 bg-white mt-2 rounded-full" />

        {roles.includes("Dispatcher") || roles.includes("Admin") ? (
          <Pressable
            className="absolute right-3 top-5 bg-red-600 px-4 py-3 rounded-full shadow-md h-[40px]"
            onPress={() => router.push("/newEvent")}
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
          events.reverse().map((event) => (
            <View
              key={event.id}
              className="bg-blue-50 border border-blue-300 rounded-xl shadow-sm mb-4 p-4"
            >
              <Text className="text-xl font-bold text-blue-800 mb-2 text-right">
                {event.anamnesis}
              </Text>
              <Text className="text-base text-gray-700 mb-4 text-right">
                {event.street + " " + event.house_number}
              </Text>

              <View className="flex-row justify-between">
                <Pressable
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                  onPress={() =>
                    router.push({
                      pathname: "/detailedEvent/[id]",
                      params: { id: event.id },
                    })
                  }
                >
                  <Text className="text-white font-semibold">פרטים נוספים</Text>
                </Pressable>

                <Pressable
                  className={`px-4 py-2 rounded-lg ${
                    event.isActive ? "bg-red-600" : "bg-gray-400 opacity-50"
                  }`}
                  disabled={!event.isActive}
                  onPress={() => {
                    router.push({
                      pathname: "/ArrivingToEvent",
                    });
                    receiveEvent(event);
                  }}
                >
                  <Text className="text-white font-semibold">
                    {event.isActive ? "קבל אירוע" : "אירוע בוטל"}{" "}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
