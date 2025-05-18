// app/events/[id].tsx
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { subscribeToEvents, Event } from "@/services/events";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailsHeader from "./DetailsHeader";

export default function EventDetails() {
  const { id } = useLocalSearchParams(); // id = createdAt
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToEvents((events, error) => {
      if (error || !events) {
        setEvent(null);
        setLoading(false);
        return;
      }

      const found = events.find((e) => e.id === id);
      setEvent(found || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען פרטי אירוע...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>אירוע לא נמצא</Text>
      </View>
    );
  }

  const details = [
    { label: "שם האירוע", value: event?.anamnesis },
    { label: "תאריך", value: event?.createdAt },
    { label: "מיקום", value: event?.location },
    { label: "תיאור", value: event?.description },
    { label: "סטטוס", value: event?.status },
    { label: "סוג אירוע", value: event?.eventType },
    { label: "אחריות", value: event?.responsibility },
]

  return (
    <SafeAreaView>
      <DetailsHeader />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        className="bg-white"
      >

        {Object.entries(event).map(([key, value]) => (
          <View key={key} className="mb-4 border-b border-gray-200 pb-2">
            <Text className="text-sm text-gray-500 text-right">{key}</Text>
            <Text className="text-lg text-right text-gray-800">{value}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}


