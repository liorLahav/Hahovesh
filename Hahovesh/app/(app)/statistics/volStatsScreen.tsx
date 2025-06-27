// volStatsScreen.tsx
import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import DateRangePicker from "./dateRangeSelector";
import VolunteerPicker from "./volSelector";
import VolunteerCard from "./volCard";

import { triggerStatisticsUpdate } from "./volStatsUpdater";
import { StatsPeriod, VolunteerStats } from "../../../services/volunteerAnalyticsService";
import {
  getTotalEvents,
  getTransportCounts,
  getReceiverCounts,
  getAddressCounts,
  getNoReportCount,
  getCountsByWeekday,
  getCountsByHour,
  getCountsByMonth,
  getCountsByYear,
} from "../../../services/globalStatsService";

// Firestore imports for manual volunteerStats fetch
import { db } from '../../../FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MainVolunteerStats() {
  const [period, setPeriod] = useState<StatsPeriod>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedVolunteerName, setSelectedVolunteerName] = useState<string | null>(null);

  // Global stats state
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [activeVolunteersCount, setActiveVolunteersCount] = useState(0);
  const [transportBreakdown, setTransportBreakdown] = useState<Record<string, number>>({});
  const [receiverBreakdown, setReceiverBreakdown] = useState<Record<string, number>>({});
  const [addressBreakdown, setAddressBreakdown] = useState<Record<string, number>>({});
  const [noReportCount, setNoReportCount] = useState(0);
  const [countsByWeekday, setCountsByWeekday] = useState<Record<string, number>>({});
  const [countsByHour, setCountsByHour] = useState<Record<number, number>>({});
  const [countsByMonth, setCountsByMonth] = useState<Record<string, number>>({});
  const [countsByYear, setCountsByYear] = useState<Record<number, number>>({});
  const [showWeekday, setShowWeekday] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);

  // Volunteer stats state
  const [volLoading, setVolLoading] = useState(false);
  const [volError, setVolError] = useState<string | null>(null);
  const [volStats, setVolStats] = useState<VolunteerStats[]>([]);

  // 1) Fetch global stats
  const fetchGlobalStats = async () => {
    setGlobalLoading(true);
    setGlobalError(null);
    try {
      const [
        totalRes,
        transRes,
        recvRes,
        noRepRes,
        byWeekday,
        byHour,
        byMonth,
        byYear,
      ] = await Promise.all([
        getTotalEvents(period, startDate, endDate),
        getTransportCounts(period, startDate, endDate),
        getReceiverCounts(period, startDate, endDate),
        getNoReportCount(period, startDate, endDate),
        getCountsByWeekday(period, startDate, endDate),
        getCountsByHour(period, startDate, endDate),
        getCountsByMonth(period, startDate, endDate),
        getCountsByYear(period, startDate, endDate),
      ]);
      setTotalEvents(totalRes);
      setTransportBreakdown(transRes);
      setReceiverBreakdown(recvRes);
      setAddressBreakdown(await getAddressCounts(period, startDate, endDate));
      setNoReportCount(noRepRes);
      setActiveVolunteersCount(Object.keys(recvRes).length);
      setCountsByWeekday(byWeekday);
      setCountsByHour(byHour);
      setCountsByMonth(byMonth);
      setCountsByYear(byYear);
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : 'שגיאה');
      setTotalEvents(0);
      setTransportBreakdown({});
      setReceiverBreakdown({});
      setAddressBreakdown({});
      setNoReportCount(0);
      setActiveVolunteersCount(0);
      setCountsByWeekday({});
      setCountsByHour({});
      setCountsByMonth({});
      setCountsByYear({});
    } finally {
      setGlobalLoading(false);
    }
  };

  // 2) Fetch volunteer stats by v_full_name
  const fetchVolStats = async () => {
    if (!selectedVolunteerName) {
      setVolStats([]);
      return;
    }
    setVolLoading(true);
    setVolError(null);
    try {
      const statsQ = query(
        collection(db, 'volunteerStats'),
        where('v_full_name', '==', selectedVolunteerName)
      );
      const snap = await getDocs(statsQ);
      if (snap.empty) {
        setVolStats([]);
        setVolError('לא נמצאו נתונים למתנדב זה');
      } else {
        const docSnap = snap.docs[0];
        const data = docSnap.data();
        setVolStats([{
          id: docSnap.id,
          name: data.v_full_name,
          eventsCount: data.eventsCount || 0,
          summariesCount: data.summariesCount || 0,
          responseTimeAvg: data.responseTimeAvg || 0,
          formQuality: data.formQuality || 0,
          events: data.events || []
        }]);
      }
    } catch (e) {
      setVolError(e instanceof Error ? e.message : 'שגיאה בטעינת נתונים');
      setVolStats([]);
    } finally {
      setVolLoading(false);
    }
  };

  // 3) On screen focus (or filter change), await update then fetch both sets
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          await triggerStatisticsUpdate();
          await fetchGlobalStats();
          await fetchVolStats();
        } catch (err) {
          console.error(err);
        }
      })();
    }, [period, startDate, endDate, selectedVolunteerName])
  );

  // 4) Also re-fetch volunteer stats any time they pick a different name
  useEffect(() => {
    fetchVolStats();
  }, [selectedVolunteerName]);

  // Helper for dropdown sections
  const renderDropdown = (
    title: string,
    open: boolean,
    toggle: () => void,
    content: React.ReactNode
  ) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <Pressable onPress={toggle} className="flex-row-reverse items-center justify-between">
        <Text className="text-lg font-bold text-blue-800 text-right">{title}</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={24} color="#1d4ed8" />
      </Pressable>
      {open && <View className="mt-2">{content}</View>}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-blue-100">
      {/* Header */}
      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text className="text-3xl text-white font-bold tracking-wide">סטטיסטיקות</Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" />
      </View>

      {/* Date Picker */}
      <DateRangePicker
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <ScrollView className="flex-1 p-4">
        {/* Core Stats */}
        <View className="bg-white rounded-lg p-5 mb-6 shadow-md">
          <Text className="text-lg font-bold text-blue-800 mb-4 text-right">סקירה כללית</Text>
          {globalLoading ? (
            <View className="items-center justify-center py-6">
              <ActivityIndicator size="small" color="#1d4ed8" />
              <Text className="mt-3 text-gray-600 text-right">
                טוען סטטיסטיקות כלליות...
              </Text>
            </View>
          ) : globalError ? (
            <View className="bg-red-50 p-3 rounded-md border border-red-200">
              <Text className="text-red-600 text-right">{globalError}</Text>
            </View>
          ) : (
            <>
              <View className="flex-row-reverse items-center justify-between mb-4">
                <Text className="text-gray-700 text-base">סה״כ אירועים:</Text>
                <Text className="text-2xl font-semibold text-gray-800">{totalEvents}</Text>
              </View>
              <View className="flex-row-reverse items-center justify-between mb-5">
                <Text className="text-gray-700 text-base">מתנדבים פעילים:</Text>
                <Text className="text-2xl font-semibold text-gray-800">
                  {activeVolunteersCount}
                </Text>
              </View>
              <View className="border-t border-gray-200 my-4" />
              <Text className="text-gray-700 mb-2 text-right font-medium">אמצעי פינוי:</Text>
              {Object.entries(transportBreakdown).length > 0 ? (
                Object.entries(transportBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([t, c]) => (
                    <View
                      key={t}
                      className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
                    >
                      <Text className="text-gray-800 text-sm flex-1 text-right">{t}</Text>
                      <Text className="text-blue-600 font-medium">{c}</Text>
                    </View>
                  ))
              ) : (
                <Text className="text-gray-500 text-sm text-right">
                  אין נתונים לאמצעי פינוי.
                </Text>
              )}
              <View className="border-t border-gray-200 my-4" />
              <Text className="text-gray-700 mb-2 text-right font-medium">מקור הפנייה:</Text>
              {Object.entries(receiverBreakdown).length > 0 ? (
                Object.entries(receiverBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([r, c]) => (
                    <View
                      key={r}
                      className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
                    >
                      <Text className="text-gray-800 text-sm flex-1 text-right">{r}</Text>
                      <Text className="text-blue-600 font-medium">{c}</Text>
                    </View>
                  ))
              ) : (
                <Text className="text-gray-500 text-sm text-right">
                  אין נתונים להצגה.
                </Text>
              )}
              <View className="border-t border-gray-200 my-4" />
              <View className="flex-row-reverse items-center justify-between mb-5">
                <Text className="text-gray-700 text-base">אירועים ללא סיכום:</Text>
                <Text className="text-red-600 font-medium">{noReportCount}</Text>
              </View>
              <View className="border-t border-gray-200 my-4" />
              <Text className="text-gray-700 mb-2 text-right font-medium">חלוקת כתובות:</Text>
              {Object.entries(addressBreakdown).length > 0 ? (
                Object.entries(addressBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([a, c]) => (
                    <View
                      key={a}
                      className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
                    >
                      <Text
                        className="text-gray-800 text-sm flex-1 text-right"
                        numberOfLines={1}
                      >
                        {a}
                      </Text>
                      <Text className="text-blue-600 font-medium">{c}</Text>
                    </View>
                  ))
              ) : (
                <Text className="text-gray-500 text-sm text-right">
                  אין נתונים להצגה.
                </Text>
              )}
              {Object.entries(addressBreakdown).length > 10 && (
                <Text className="text-gray-400 text-xs text-right mt-2">
                  ועוד {Object.entries(addressBreakdown).length - 10} כתובות...
                </Text>
              )}
            </>
          )}
        </View>

        {/* Dropdowns */}
        {renderDropdown(
          "אירועים לפי יום בשבוע",
          showWeekday,
          () => setShowWeekday(!showWeekday),
          Object.entries(countsByWeekday).map(([d, c]) => (
            <View
              key={d}
              className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
            >
              <Text className="text-gray-800 text-sm text-right">{d}</Text>
              <Text className="text-blue-600 font-medium">{c}</Text>
            </View>
          ))
        )}
        {renderDropdown(
          "אירועים לפי שעה",
          showHour,
          () => setShowHour(!showHour),
          Object.entries(countsByHour).map(([h, c]) => (
            <View
              key={h}
              className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
            >
              <Text className="text-gray-800 text-sm text-right">{h}:00</Text>
              <Text className="text-blue-600 font-medium">{c}</Text>
            </View>
          ))
        )}
        {renderDropdown(
          "אירועים לפי חודש",
          showMonth,
          () => setShowMonth(!showMonth),
          Object.entries(countsByMonth)
            .sort()
            .map(([m, c]) => (
              <View
                key={m}
                className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
              >
                <Text className="text-gray-800 text-sm text-right">{m}</Text>
                <Text className="text-blue-600 font-medium">{c}</Text>
              </View>
            ))
        )}
        {renderDropdown(
          "אירועים לפי שנה",
          showYear,
          () => setShowYear(!showYear),
          Object.entries(countsByYear).map(([y, c]) => (
            <View
              key={y}
              className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
            >
              <Text className="text-gray-800 text-sm text-right">{y}</Text>
              <Text className="text-blue-600 font-medium">{c}</Text>
            </View>
          ))
        )}

        {/* Volunteer Picker & Stats */}
        <VolunteerPicker
          selectedVolunteerName={selectedVolunteerName}
          onSelectVolunteer={setSelectedVolunteerName}
        />
        {selectedVolunteerName == null ? (
          <View className="bg-white rounded-lg p-6 shadow-sm items-center justify-center mt-4">
            <Ionicons name="people" size={60} color="#93c5fd" />
            <Text className="text-lg font-bold text-blue-800 mt-4 mb-2 text-center">
              בחר מתנדב כדי לצפות בסטטיסטיקות
            </Text>
          </View>
        ) : volLoading ? (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#1d4ed8" />
            <Text className="mt-4 text-blue-800 text-lg text-right">טוען נתונים...</Text>
          </View>
        ) : volError ? (
          <View className="bg-red-50 p-4 rounded-lg border border-red-200 items-center my-4">
            <Text className="text-red-700 text-lg font-bold mb-2 text-right">שגיאה</Text>
            <Text className="text-red-600 text-right">{volError}</Text>
          </View>
        ) : (
          volStats.map(v => <VolunteerCard key={v.id} volunteer={v} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
