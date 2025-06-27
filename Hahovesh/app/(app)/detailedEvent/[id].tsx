import { View, Text, ScrollView, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { subscribeToEvents, Event, updateEvent } from "@/services/events";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailsHeader from "./DetailsHeader";
import EditableDetailRow from "./EditableDetailRow";
import EditModal from "./EditModal";
import CancelEventButton from "./CancelEventButton";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";
import { useError } from "@/hooks/UseError";
import { set } from "firebase/database";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, userLoading } = useUserContext();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<string | null>(null);
  const [fieldLabel, setFieldLabel] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");
  const roles = user.permissions || [];
  const { setErrorMessage, cleanError } = useError();

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

  if (loading || userLoading) {
    return <Loading message="טוען פרטי אירוע..." />;
  }
  console.log("roles:", user.permissions);

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>אירוע לא נמצא</Text>
      </View>
    );
  }

  const handleSave = async () => {
    cleanError(); // Clear any previous errors
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
        setEditModalVisible(false);
        console.error("Error updating event:", error);
        setErrorMessage("שגיאה בעדכון האירוע");
      }
    }
  };

  const getDetails = () => [
    { label: "סוג האירוע", key: "anamnesis", value: event?.anamnesis },
    {
      label: "תאריך",
      key: "createdAt",
      value: new Date(event?.createdAt).toLocaleString("he-il", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
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
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        className=" bg-blue-50"
      >
        {getDetails().map((detail) => (
          <EditableDetailRow
            key={detail.label}
            label={detail.label}
            value={String(detail.value || "")}
            canEdit={
              (roles.includes("Dispatcher") || roles.includes("Admin")) &&
              detail.label !== "תאריך"
            }
            onEdit={() => {
              setFieldToEdit(detail.key);
              setEditedValue(String(detail.value || ""));
              setFieldLabel(detail.label);
              setEditModalVisible(true);
            }}
          />
        ))}
        {roles.includes("Dispatcher") || roles.includes("Admin") ? (
          <View className="items-end mt-2">
            <CancelEventButton event={event} />
          </View>
        ) : null}
      </ScrollView>
      <EditModal
        visible={editModalVisible}
        fieldLabel={fieldLabel}
        editedValue={editedValue}
        onChange={setEditedValue}
        onCancel={() => setEditModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}
