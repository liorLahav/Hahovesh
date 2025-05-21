import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  subscribeToEvents,
  Event,
  deleteEvent,
  updateEvent,
} from "@/services/events";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRolesContext } from "@/hooks/RolesContext";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import DetailsHeader from "./DetailsHeader";
import { set } from "firebase/database";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { roles, rolesLoading } = useRolesContext();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");
  const [fieldLabel, setFieldLabel] = useState<string | null>(null);

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

  const handleSave = async () => {
    if (event) {
      try {
        await updateEvent(event.id, {
          ...event,
          [fieldToEdit!]: editedValue,
        });

        setEvent((prev) =>
          prev ? { ...prev, [fieldToEdit!]: editedValue } : prev
        );

        setEditModalVisible(false);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    }
  };

  const getDetails = () => [
    { label: "סוג האירוע", key: "anamnesis", value: event?.anamnesis },
    { label: "תאריך", key: "createdAt", value: event?.createdAt },
    { label: "רחוב", key: "street", value: event?.street },
    { label: "מספר בית", key: "house_number", value: event?.house_number },
    {
      label: "פרטי דירה",
      key: "apartment_details",
      value: event?.apartment_details,
    },
    { label: "מיקום", key: "location_type", value: event?.location_type },
    { label: "קוד רפואי", key: "medical_code", value: event?.medical_code },
    { label: "קוד הזנקה", key: "haznk_code", value: event?.haznk_code },
    { label: "מוקד מקבל", key: "recipient", value: event?.recipient },
    { label: "דחיפות", key: "urgency", value: event?.urgency },
    { label: "טלפון פונה", key: "phone_number1", value: event?.phone_number1 },
    { label: "טלפון נוסף", key: "phone_number2", value: event?.phone_number2 },
    { label: "גיל פונה", key: "patient_age", value: event?.patient_age },
    { label: "שם פונה", key: "patient_name", value: event?.patient_name },
    { label: "מין פונה", key: "patient_sex", value: event?.patient_sex },
    {
      label: "מודיע",
      key: "informat_location",
      value: event?.informat_location,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-grey-200">
      <DetailsHeader />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        className=" bg-blue-50"
      >
        {getDetails().map((detail) => (
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
            {roles.includes("Dispatcher") || roles.includes("Admin") ? (
              <View className="absolute">
                <Pressable
                  onPress={() => {
                    setFieldToEdit(detail.key);
                    setEditedValue(detail.value || "");
                    setFieldLabel(detail.label);
                    setEditModalVisible(true);
                  }}
                  className=" bg-blue-100 p-2 rounded-full shadow-sm h-[40px] w-[80px] items-center flex-row gap-1"
                >
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="create-outline" size={18} color="black" />
                    <Text>עריכה</Text>
                  </View>
                </Pressable>
              </View>
            ) : null}
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
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-[90%] p-5 rounded-2xl shadow-lg">
            <Text className="text-center text-lg font-bold mb-4 text-blue-900">
              ערוך {fieldLabel}
            </Text>

            <TextInput
              value={editedValue}
              onChangeText={setEditedValue}
              className="border border-blue-200 p-3 rounded-md text-right"
            />

            <View className="flex-row justify-center gap-4 mt-6">
              <Pressable
                onPress={() => setEditModalVisible(false)}
                className="bg-red-600 px-6 py-2 rounded-full shadow"
              >
                <Text className="text-white font-bold text-base">ביטול</Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                className="bg-green-600 px-6 py-2 rounded-full shadow"
              >
                <Text className="text-white font-bold text-base">שמור</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

