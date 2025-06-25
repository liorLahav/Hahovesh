import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { fetchEventSummaries, EventSummary } from '@/services/event_summary';
import Header from './Header';
import FilterBar from './FilterBar';
import ReportCard from './ReportCard';
import { filterReports, FilterType } from './filterReports';

export default function SummaryReportsScreen() {
  const [reports, setReports] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [customDate, setCustomDate] = useState<Date | null>(null);

  const loadReports = async () =>
    fetchEventSummaries().then(setReports).finally(() => setLoading(false));

  useEffect(() => { loadReports(); }, []);

  useFocusEffect(
    React.useCallback(() => { loadReports(); }, [])
  );

  const filtered = filterReports(reports, filter, customDate);

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
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <ReportCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 }}
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
