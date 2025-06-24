import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import DateRangePicker from "./dateRangeSelector";
import VolunteerPicker from "./volSelector";
import VolunteerCard from "./volCard";
import UpdateHandler from "./updateHandler";

import { StatsPeriod, VolunteerStats } from "../../../services/volunteerAnalyticsService";
import { useStatistics } from "./useVolData";

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

export default function MainVolunteerStats() {
  // Date range & volunteer selection state
  const [period, setPeriod] = useState<StatsPeriod>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedVolunteerName, setSelectedVolunteerName] = useState<string | null>(null);

  // Global stats state
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Core stats
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [activeVolunteersCount, setActiveVolunteersCount] = useState<number>(0);
  const [transportBreakdown, setTransportBreakdown] = useState<Record<string, number>>({});
  const [receiverBreakdown, setReceiverBreakdown] = useState<Record<string, number>>({});
  const [addressBreakdown, setAddressBreakdown] = useState<Record<string, number>>({});
  const [noReportCount, setNoReportCount] = useState<number>(0);

  // Time-based breakdown states
  const [countsByWeekday, setCountsByWeekday] = useState<Record<string, number>>({});
  const [countsByHour, setCountsByHour] = useState<Record<number, number>>({});
  const [countsByMonth, setCountsByMonth] = useState<Record<string, number>>({});
  const [countsByYear, setCountsByYear] = useState<Record<number, number>>({});

  // Dropdown visibility state
  const [showWeekday, setShowWeekday] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);

  // Fetch global stats whenever period, startDate, or endDate change
  const fetchGlobalStats = async () => {
    setGlobalLoading(true);
    setGlobalError(null);

    try {
      const [
        totalEventsResult,
        transportCountsResult,
        receiverCountsResult,
        addressCountsResult,
        noReportCountResult,
        countsByWeekdayResult,
        countsByHourResult,
        countsByMonthResult,
        countsByYearResult,
      ] = await Promise.all([
        getTotalEvents(period, startDate, endDate),
        getTransportCounts(period, startDate, endDate),
        getReceiverCounts(period, startDate, endDate),
        getAddressCounts(period, startDate, endDate),
        getNoReportCount(period, startDate, endDate),
        getCountsByWeekday(period, startDate, endDate),
        getCountsByHour(period, startDate, endDate),
        getCountsByMonth(period, startDate, endDate),
        getCountsByYear(period, startDate, endDate),
      ]);

      setTotalEvents(totalEventsResult || 0);
      setTransportBreakdown(transportCountsResult || {});
      setReceiverBreakdown(receiverCountsResult || {});
      setAddressBreakdown(addressBreakdown || {});
      setNoReportCount(noReportCountResult || 0);
      setActiveVolunteersCount(Object.keys(receiverBreakdown).length);

      setCountsByWeekday(countsByWeekdayResult);
      setCountsByHour(countsByHourResult);
      setCountsByMonth(countsByMonthResult);
      setCountsByYear(countsByYearResult);
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : 'שגיאה לא ידועה');
      // Reset on error
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

  useEffect(() => {
    fetchGlobalStats();
  }, [period, startDate, endDate]);

  // Per-volunteer statistics
  const { data: volunteerData, loading: volLoading, error: volError } = useStatistics(
    period,
    selectedVolunteerName || undefined,
    startDate,
    endDate
  );

  const renderDropdown = (
    title: string,
    open: boolean,
    toggle: () => void,
    content: React.ReactNode
  ) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-md">
      <Pressable
        onPress={toggle}
        className="flex-row-reverse items-center justify-between"
      >
        <Text className="text-lg font-bold text-blue-800 text-right">{title}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={24}
          color="#1d4ed8"
        />
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

      {/* Update Button */}
      <View className="px-4 py-2 flex-row justify-end">
        <UpdateHandler />
      </View>

      {/* Date range Picker */}
      <DateRangePicker
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <ScrollView className="flex-1 p-4">
        {/* Core Stats Section */}
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

              <View className="mb-5">
                <Text className="text-gray-700 mb-2 text-right font-medium">
                  אמצעי פינוי:
                </Text>
                {Object.entries(transportBreakdown).length > 0 ? (
                  Object.entries(transportBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([type, cnt]) => (
                      <View
                        key={type}
                        className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
                      >
                        <Text className="text-gray-800 text-sm flex-1 text-right">
                          {type}
                        </Text>
                        <Text className="text-blue-600 font-medium">{cnt}</Text>
                      </View>
                    ))
                ) : (
                  <Text className="text-gray-500 text-sm text-right">
                    אין נתונים לאמצעי פינוי.
                  </Text>
                )}
              </View>

              <View className="border-t border-gray-200 my-4" />

              <View className="mb-5">
                <Text className="text-gray-700 mb-2 text-right font-medium">
                  מקור הפנייה:
                </Text>
                {Object.entries(receiverBreakdown).length > 0 ? (
                  Object.entries(receiverBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([rec, cnt]) => (
                      <View
                        key={rec}
                        className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
                      >
                        <Text className="text-gray-800 text-sm flex-1 text-right">
                          {rec}
                        </Text>
                        <Text className="text-blue-600 font-medium">{cnt}</Text>
                      </View>
                    ))
                ) : (
                  <Text className="text-gray-500 text-sm text-right">
                    אין נתונים להצגה.
                  </Text>
                )}
              </View>

              <View className="border-t border-gray-200 my-4" />

              <View className="flex-row-reverse items-center justify-between mb-5">
                <Text className="text-gray-700 text-base">
                  אירועים ללא סיכום:
                </Text>
                <Text className="text-red-600 font-medium">{noReportCount}</Text>
              </View>

              <View className="border-t border-gray-200 my-4" />

              <View>
                <Text className="text-gray-700 mb-2 text-right font-medium">
                  חלוקת כתובות:
                </Text>
                {Object.entries(addressBreakdown).length > 0 ? (
                  Object.entries(addressBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([addr, cnt]) => (
                      <View
                        key={addr}
                        className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
                      >
                        <Text
                          className="text-gray-800 text-sm flex-1 text-right"
                          numberOfLines={1}
                        >
                          {addr}
                        </Text>
                        <Text className="text-blue-600 font-medium">{cnt}</Text>
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
              </View>
            </>
          )}
        </View>

        {/* Dropdowned Breakdown Sections */}
        {renderDropdown(
          "אירועים לפי יום בשבוע",
          showWeekday,
          () => setShowWeekday(!showWeekday),
          Object.entries(countsByWeekday).map(([day, cnt]) => (
            <View
              key={day}
              className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
            >
              <Text className="text-gray-800 text-sm text-right">{day}</Text>
              <Text className="text-blue-600 font-medium">{cnt}</Text>
            </View>
          ))
        )}

        {renderDropdown(
          "אירועים לפי שעה",
          showHour,
          () => setShowHour(!showHour),
          Object.entries(countsByHour).map(([hour, cnt]) => (
            <View
              key={hour}
              className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
            >
              <Text className="text-gray-800 text-sm text-right">{hour}:00</Text>
              <Text className="text-blue-600 font-medium">{cnt}</Text>
            </View>
          ))
        )}

        {renderDropdown(
          "אירועים לפי חודש",
          showMonth,
          () => setShowMonth(!showMonth),
          Object.entries(countsByMonth)
            .sort()
            .map(([month, cnt]) => (
              <View
                key={month}
                className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
              >
                <Text className="text-gray-800 text-sm text-right">{month}</Text>
                <Text className="text-blue-600 font-medium">{cnt}</Text>
              </View>
            ))
        )}

        {renderDropdown(
          "אירועים לפי שנה",
          showYear,
          () => setShowYear(!showYear),
          Object.entries(countsByYear).map(([year, cnt]) => (
            <View
              key={year}
              className="flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded"
            >
              <Text className="text-gray-800 text-sm text-right">{year}</Text>
              <Text className="text-blue-600 font-medium">{cnt}</Text>
            </View>
          ))
        )}

        {/* Volunteer Selection Section */}
        <VolunteerPicker
          selectedVolunteerName={selectedVolunteerName}
          onSelectVolunteer={setSelectedVolunteerName}
        />

        {/* Volunteer-Specific Section */}
        {selectedVolunteerName == null ? (
          <View className="bg-white rounded-lg p-6 shadow-sm items-center justify-center mt-4">
            <Ionicons name="people" size={60} color="#93c5fd" />
            <Text className="text-lg font-bold text-blue-800 mt-4 mb-2 text-center">
              בחר מתנדב כדי לצפות בסטטיסטיקות
            </Text>
            <Text className="text-gray-500 text-center">
              בחר מתנדב מהרשימה למעלה כדי לראות את הסטטיסטיקות שלו
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
        ) : volunteerData && volunteerData.volunteerStats.length > 0 ? (
          <View>
            <Text className="text-xl font-bold text-blue-800 mb-4 text-right">
              {`סטטיסטיקות: ${selectedVolunteerName}`}
            </Text>

            {volunteerData.volunteerStats.map((vol: VolunteerStats) => (
              <VolunteerCard key={vol.id} volunteer={vol} />
            ))}
          </View>
        ) : (
          <View className="bg-white rounded-lg p-4 shadow-sm items-center">
            <Text className="text-gray-500 text-right">לא נמצאו נתונים בטווח הזמן הנבחר</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
