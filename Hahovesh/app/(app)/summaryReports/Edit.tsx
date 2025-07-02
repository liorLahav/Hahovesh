/* summaryReports/Edit.tsx – טופס עריכת דוח קיים */

import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

import DynamicForm from "@/components/DynamicForm";
import formSchema_eventSummary from "@/data/fromSchema_eventSummary";
import { getEventSummary, updateEventSummary } from "@/services/event_summary";
import { FIELD_LABELS, READ_ONLY_KEYS } from "./fields";
import logo from "../../../assets/images/logo.png";
import { Image } from "react-native";
import tw from "twrnc";

const EditHeader = () => {
  const router = useRouter();
  return (
    <>
      <View style={tw`w-full h-1 bg-red-500 rounded-t-xl`} />
      <View style={tw`bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-2xl shadow-sm`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Pressable onPress={() => router.replace("/summaryReports")}>
            <Ionicons name="arrow-back" size={28} color="#1e3a8a" />
          </Pressable>

          <Text style={tw`text-xl font-bold text-blue-800`}>
            עריכת דוח סיכום
          </Text>

          <Image
            source={logo}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </>
  );
};

export default function EditSummaryForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [initialValues, setInitialValues] = useState<Record<
    string,
    string
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [reaload, setReload] = useState(false);

  useEffect(() => {
    (async () => {
      const doc = await getEventSummary(id);
      if (!doc) return setLoading(false);

      const defaults = formSchema_eventSummary.reduce(
        (acc, f) => ({ ...acc, [f.key]: (doc as any)[f.key] ?? "" }),
        {} as Record<string, string>
      );

      setInitialValues(defaults);
      setLoading(false);
      setReload(false);
    })();
  }, [id,reaload]);

  const onSubmit = useCallback(
    async (values: Record<string, string>) => {
      READ_ONLY_KEYS.forEach((k) => delete values[k]);
      try {
        await updateEventSummary(id, values);
        Alert.alert("הצלחה", "הדוח עודכן בהצלחה");
        setReload(true);
        router.replace("/summaryReports");
      } catch (err) {
        console.error(err);
        Alert.alert("שגיאה", "לא ניתן לשמור את השינויים");
      }
    },
    [id]
  );

   const editableSchema = formSchema_eventSummary.filter(
    (f) => !READ_ONLY_KEYS.includes(f.key as (typeof READ_ONLY_KEYS)[number]),
  );



  if (loading || !initialValues) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <EditHeader />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <DynamicForm
          schema={editableSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
          submitLabel="שמור שינויים"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
