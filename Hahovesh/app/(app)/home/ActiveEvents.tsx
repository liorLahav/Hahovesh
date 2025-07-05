import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import {
  subscribeToEvents,
  Event,
  addVolunteerToEvent,
} from "@/services/events";
import { updateUserStatus } from "@/services/users";
import { useEventContext } from "@/hooks/EventContext";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";
import { useError } from "@/hooks/UseError";
import tw from "twrnc";

export default function ActiveEvents() {
  const { user, userLoading } = useUserContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const unsubscribeRef = useRef<() => void | null>(null);
  const { isEventActive, changeEvent } = useEventContext();
  const [pressed, setIsPressed] = useState<boolean>(false);
  const roles = user.permissions || [];
  const { setErrorMessage, cleanError } = useError();

  const eventEnds = (event: Event) => !!event.summaryReportFiller;

  const receiveEvent = async (event: Event) => {
    if (pressed)
      return;
    setIsPressed(true);
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    if (event.summaryReportFiller) {
      Alert.alert("אירוע זה בשלבי סיום אין צורך בעוד חובשים");
      return;
    }
    try {
      cleanError();
      await updateUserStatus(user.id, "Arriving : " + event.id);
    } catch {
      setErrorMessage("שגיאה בעדכון הסטטוס שלך באירוע");
    }
    try {
      cleanError();
      await addVolunteerToEvent(event.id, user.id);
    } catch {
      setErrorMessage("שגיאה בצירופך לאירוע, פנה למנהל");
    }
    changeEvent(event);
    router.push({ pathname: "/ArrivingToEvent" });
    setIsPressed(false);
  };

  useEffect(() => {
    cleanError();
    setLoadingEvents(true);
    if (!isEventActive) {
      const unsubscribeFunction = subscribeToEvents((fetchedEvents, error) => {
        if (error) {
          setErrorMessage("שגיאה בשליפת אירועים");
          setLoadingEvents(false);
          return;
        }
        setEvents(fetchedEvents || []);
        setLoadingEvents(false);
      });
      unsubscribeRef.current = unsubscribeFunction;
      return () => {
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
      };
    }
  }, [isEventActive]);

  if (userLoading || loadingEvents) {
    return <Loading />;
  }

  const orderedEvents = events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <View
        style={tw`bg-blue-700 py-5 rounded-b-2xl shadow-md items-center justify-center`}
      >
        <Text
          style={[
            tw`text-white tracking-wide text-[20px]`,
            { fontFamily: "Assistant-Bold" },
          ]}
        >
          אירועים פעילים
        </Text>

        {roles.includes("Dispatcher") || roles.includes("Admin") ? (
          <Pressable
            style={tw`absolute right-2 top-4 bg-red-600 px-3 py-2 rounded-full shadow-md h-[40px] justify-center items-center`}
            onPress={() => router.push("/newEvent")}
          >
            <Text style={tw`text-white font-bold text-base`}>אירוע חדש</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ padding: 10, paddingBottom: 100 }}>
        {events.length === 0 ? (
          <Text style={tw`text-center text-lg text-blue-700 mt-8`}>
            לא נמצאו אירועים פעילים
          </Text>
        ) : (
          orderedEvents.map((event) => {
            const volunteers = Object.values(event.volunteers ?? {});
            const joinedToEvent = volunteers.filter(
              (vol) => vol.joinedAt && !vol.arrivedAt
            ).length;
            const arrivedToEvent = volunteers.filter(
              (vol) => vol.arrivedAt
            ).length;

            return (
              <View
                key={event.id}
                style={tw`bg-blue-50 border border-blue-300 rounded-xl shadow-sm mb-4 p-4`}
              >
                <View style={tw`flex flex-row justify-between`}>
                  <View style={tw`flex flex-col`}>
                    <Text style={tw`text-sm text-red-500 font-bold`}>
                      חובשים בדרך: {joinedToEvent}
                    </Text>
                    <Text style={tw`text-sm text-red-500 font-bold`}>
                      חובשים באירוע: {arrivedToEvent}
                    </Text>
                  </View>
                  <Text
                    style={tw`text-xl font-bold text-blue-800 mb-2 text-right`}
                  >
                    {event.medical_code}
                  </Text>
                </View>
                <Text style={tw`text-base text-gray-700 mb-4 text-right`}>
                  {event.street + " " + event.house_number}
                </Text>

                <View style={tw`flex-row justify-between`}>
                  <Pressable
                    style={tw`bg-blue-600 px-4 py-2 rounded-lg`}
                    onPress={() =>
                      router.push({
                        pathname: "/detailedEvent/[id]",
                        params: { id: event.id },
                      })
                    }
                  >
                    <Text style={tw`text-white font-semibold`}>
                      פרטים נוספים
                    </Text>
                  </Pressable>

                  <Pressable
                    style={tw.style(
                      event.summaryReportFiller || !event.isActive
                        ? `bg-gray-400 opacity-50`
                        : `bg-red-600`,
                      `px-4 py-2 rounded-lg`
                    )}
                    disabled={!event.isActive || eventEnds(event)}
                    onPress={() => receiveEvent(event)}
                  >
                    <Text style={tw`text-white font-semibold`}>
                      {eventEnds(event)
                        ? "אירוע בסיום"
                        : event.isActive
                        ? "קבל אירוע"
                        : "אירוע בוטל"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
