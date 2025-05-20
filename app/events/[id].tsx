import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { subscribeToEvents, Event, deleteEvent } from "@/services/events";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRolesContext } from "@/hooks/RolesContext";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import DetailsHeader from "./DetailsHeader";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { roles, rolesLoading } = useRolesContext();
  const router = useRouter();

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

  if (loading || rolesLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען פרטי אירוע...</Text>
      </View>
    );
  }
  console.log("roles:", roles);

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>אירוע לא נמצא</Text>
      </View>
    );
  }

  const details = [
    { label: "סוג האירוע", value: event?.anamnesis },
    { label: "תאריך", value: event?.createdAt.toString() },
    { label: "רחוב", value: event?.street },
    { label: "מספר בית", value: event?.house_number },
    { label: "פרטי דירה", value: event?.apartment_details },
    { label: "מיקום", value: event?.location_type },
    { label: "קוד רפואי", value: event?.medical_code },
    { label: "קוד הזנקה", value: event?.haznk_code },
    { label: "מוקד מקבל", value: event?.recipient },
    { label: "דחיפות", value: event?.urgency },
    { label: "טלפון פונה", value: event?.phone_number1 },
    { label: "טלפון נוסף", value: event?.phone_number2 },
    { label: "גיל פונה", value: event?.patient_age },
    { label: "שם פונה", value: event?.patient_name },
    { label: "מין פונה", value: event?.patient_sex },
    { label: "מודיע", value: event?.informat_location },
  ];

  return (
    <SafeAreaView className="flex-1">
      <DetailsHeader />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        className=" bg-blue-50"
      >
        {details.map((detail) => (
          <View
            key={detail.label}
            className="mb-4 border-b border-gray-200 pb-2"
          >
            <Text className="text-sm text-gray-500 text-right">
              {detail.label}
            </Text>
            <Text className="text-lg text-right text-gray-800">
              {detail.value == "" ? "-" : detail.value}
            </Text>
          </View>
        ))}
        {roles.includes("Dispatcher") || roles.includes("Admin") ? (
          <View className="items-end mt-2">
            <Pressable
              className=" bg-red-600 p-2 rounded-full shadow-md h-[40px] w-full"
              onPress={() => {
                console.log("נלחץ ביטול");
                {
                  event.id && deleteEvent(event.id);
                }
                router.push("/home/HomePage");
              }}
            >
              <Text className="text-white font-bold text-base text-center">
                ביטול אירוע
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// Alert.alert("אישור", "האם אתה בטוח שברצונך לבטל את האירוע?", [
//                   { text: "לא", style: "cancel" },
//                   {
//                     text: "כן",
//                     onPress: async () => {
//                       console.log("מוחק אירוע");
//                       await deleteEvent(event.id);
//                       router.push("/home/HomePage");
//                     },
//                   },
//                 ])
