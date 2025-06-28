// index.tsx
import React, { useEffect, useState } from "react";
import { FlatList, ActivityIndicator, Text } from "react-native";
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
  const [isScreenFocused, setIsScreenFocused] = useState(true);

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

  const filtered = filterReports(reports, filter, customDate);

  const sorted = [...filtered].sort((a, b) => {
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
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            customDate={customDate}
            setCustomDate={setCustomDate}
          />
        }
      />
    </SafeAreaView>
  );
}
