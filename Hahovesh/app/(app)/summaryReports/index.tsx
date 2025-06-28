import React, { useEffect, useState } from "react";
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { fetchEventSummaries, EventSummary } from "@/services/event_summary";
import Header from "./Header";
import FilterBar from "./FilterBar";
import ReportCard from "./ReportCard";
import { filterReports, FilterType } from "./filterReports";
import { toDate } from "./format";

export default function SummaryReportsScreen() {
  const [reports, setReports] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");          // חיפוש
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  /* --- טעינת דוחות --- */
  const loadReports = async () =>
    fetchEventSummaries()
      .then(setReports)
      .finally(() => setLoading(false));

  useEffect(() => {
    loadReports();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setIsScreenFocused(true);
      loadReports();
      return () => setIsScreenFocused(false);
    }, [])
  );

  const byDate = filterReports(reports, filter, customDate);
  
  const bySearch =
    searchQuery.trim() === ""
      ? byDate
      : byDate.filter((r) => {
          const q = searchQuery.toLowerCase();
          const has = (v: any) => String(v ?? "").toLowerCase().includes(q);

          return (
            has((r as any).medical_code) ||
            has((r as any).name) ||
            has((r as any).address) ||
            has((r as any).volenteer_id) 
          );
        });

  const sorted = [...bySearch].sort((a, b) => {
    const da = toDate((a as any).event_date);
    const db = toDate((b as any).event_date);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db.getTime() - da.getTime();
  });

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2">טוען דוחות…</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-blue-200">
      <Header />

      <FlatList
        data={sorted}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <ReportCard item={item} isScreenFocused={isScreenFocused} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        ListHeaderComponent={
          <View>
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              customDate={customDate}
              setCustomDate={setCustomDate}
            />

            <TextInput
              placeholder="🔍 חפש קוד רפואי, שם, כתובת או מספר מתנדב"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
              className="border border-gray-300 rounded-md px-4 py-2 mb-2 text-right bg-white mt-3"
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}
