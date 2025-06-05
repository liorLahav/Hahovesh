// src/volStatsScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import DateRangePicker from "./dateRangeSelector";
import VolunteerPicker from "./volSelector";
import VolunteerCard from "./volCard";
import UpdateHandler from "./updateHandler";

import { StatsPeriod, VolunteerStats } from "./volApi";
import { useStatistics } from "./useVolData";

import {
  getTotalEvents,
  getTransportCounts,
  getReceiverCounts,
  getAddressCounts,
  getNoReportCount,
} from "./globalStats";

export default function MainVolunteerStats() {
  // Date‐range & volunteer selection state
  const [period, setPeriod] = useState<StatsPeriod>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedVolunteerName, setSelectedVolunteerName] = useState<string | null>(null);

  // Global stats state
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [activeVolunteersCount, setActiveVolunteersCount] = useState<number>(0);
  const [transportBreakdown, setTransportBreakdown] = useState<Record<string, number>>({});
  const [receiverBreakdown, setReceiverBreakdown] = useState<Record<string, number>>({});
  const [addressBreakdown, setAddressBreakdown] = useState<Record<string, number>>({});
  const [noReportCount, setNoReportCount] = useState<number>(0);

  // Fetch global stats whenever period, startDate, or endDate change
  useEffect(() => {
    setGlobalLoading(true);
    setGlobalError(null);

    // 1) Total events in volunteerStats
    getTotalEvents(period, startDate, endDate)
      .then((count) => setTotalEvents(count))
      .catch((err) => {
        console.error("Error fetching total events:", err);
        setGlobalError("שגיאה בטעינת סה״כ אירועים");
      });

    // 2) Active volunteers (distinct volunteerStats docs with ≥1 event in range)
    getReceiverCounts(period, startDate, endDate)
      .then((map) => {
        setActiveVolunteersCount(Object.keys(map).length);
      })
      .catch((err) => {
        console.error("Error fetching active volunteer count:", err);
        setActiveVolunteersCount(0);
      });

    // 3) Transport breakdown from eventSummaries
    getTransportCounts(period, startDate, endDate)
      .then((map) => setTransportBreakdown(map))
      .catch((err) => {
        console.error("Error fetching transport breakdown:", err);
        setTransportBreakdown({});
      });

    // 4) Receiver/distribution breakdown (e.g., חובש, מד"א, א"ה)
    getReceiverCounts(period, startDate, endDate)
      .then((map) => setReceiverBreakdown(map))
      .catch((err) => {
        console.error("Error fetching receiver breakdown:", err);
        setReceiverBreakdown({});
      });

    // 5) Address breakdown from eventSummaries
    getAddressCounts(period, startDate, endDate)
      .then((map) => setAddressBreakdown(map))
      .catch((err) => {
        console.error("Error fetching address breakdown:", err);
        setAddressBreakdown({});
      });

    // 6) Events with no summary (empty summary field)
    getNoReportCount(period, startDate, endDate)
      .then((count) => setNoReportCount(count))
      .catch((err) => {
        console.error("Error fetching no-report count:", err);
        setNoReportCount(0);
      })
      .finally(() => setGlobalLoading(false));
  }, [period, startDate, endDate]);

  // Per‐volunteer statistics
  const {
    data: volunteerData,
    loading: volLoading,
    error: volError,
  } = useStatistics(period, selectedVolunteerName || undefined, startDate, endDate);

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

      {/* Date‐range Picker */}
      <DateRangePicker
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <ScrollView className="flex-1 p-4">
        {/* “סיכום כללי” Card */}
        <View className="bg-white rounded-lg p-5 mb-6 shadow-md">
          {/* Card Header */}
          <Text className="text-lg font-bold text-blue-800 mb-4 text-right">
            סיכום כללי
          </Text>

          {globalLoading ? (
            <View className="items-center justify-center py-6">
              <ActivityIndicator size="small" color="#1d4ed8" />
              <Text className="mt-3 text-gray-600 text-right">טוען סטטיסטיקות כלליות...</Text>
            </View>
          ) : globalError ? (
            <View className="bg-red-50 p-3 rounded-md border border-red-200">
              <Text className="text-red-600 text-right">{globalError}</Text>
            </View>
          ) : (
            <>
              {/* Total Events */}
              <View className="flex-row-reverse items-center justify-between mb-4">
                <Text className="text-gray-700 text-base">סה״כ אירועים:</Text>
                <Text className="text-2xl font-semibold text-gray-800">{totalEvents}</Text>
              </View>

              {/* Active Volunteers */}
              <View className="flex-row-reverse items-center justify-between mb-5">
                <Text className="text-gray-700 text-base">מתנדבים פעילים:</Text>
                <Text className="text-2xl font-semibold text-gray-800">{activeVolunteersCount}</Text>
              </View>

              {/* Divider */}
              <View className="border-t border-gray-200 my-4" />

              {/* Transport Breakdown */}
              <View className="mb-5">
                <Text className="text-gray-700 mb-2 text-right font-medium">חלוקת הובלות:</Text>
                {Object.entries(transportBreakdown).length > 0 ? (
                  Object.entries(transportBreakdown).map(([transportType, cnt]) => (
                    <View
                      key={transportType}
                      className="flex-row-reverse items-center justify-between mb-2"
                    >
                      <Text className="text-gray-800 text-sm">{transportType}:</Text>
                      <Text className="text-gray-800 font-medium">{cnt}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 text-sm text-right">אין נתונים לחלוקת הובלות.</Text>
                )}
              </View>

              {/* Divider */}
              <View className="border-t border-gray-200 my-4" />

              {/* Receiver Breakdown */}
              <View className="mb-5">
                <Text className="text-gray-700 mb-2 text-right font-medium">
                  חלוקת מוקדים / שולחים:
                </Text>
                {Object.entries(receiverBreakdown).length > 0 ? (
                  Object.entries(receiverBreakdown).map(([receiver, cnt]) => (
                    <View
                      key={receiver}
                      className="flex-row-reverse items-center justify-between mb-2"
                    >
                      <Text className="text-gray-800 text-sm">{receiver}:</Text>
                      <Text className="text-gray-800 font-medium">{cnt}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 text-sm text-right">אין נתונים לחלוקת מוקדים.</Text>
                )}
              </View>

              {/* Divider */}
              <View className="border-t border-gray-200 my-4" />

              {/* No‐Report Count */}
              <View className="flex-row-reverse items-center justify-between mb-5">
                <Text className="text-gray-700 text-base">אירועים ללא סיכום:</Text>
                <Text className="text-gray-800 font-medium">{noReportCount}</Text>
              </View>

              {/* Divider */}
              <View className="border-t border-gray-200 my-4" />

              {/* Address Breakdown */}
              <View>
                <Text className="text-gray-700 mb-2 text-right font-medium">חלוקת כתובות:</Text>
                {Object.entries(addressBreakdown).length > 0 ? (
                  Object.entries(addressBreakdown).map(([address, cnt]) => (
                    <View
                      key={address}
                      className="flex-row-reverse items-center justify-between mb-2"
                    >
                      <Text className="text-gray-800 text-sm">{address}:</Text>
                      <Text className="text-gray-800 font-medium">{cnt}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 text-sm text-right">אין נתונים לחלוקת כתובות.</Text>
                )}
              </View>
            </>
          )}
        </View>

        {/* “בחירת מתנדב” Section */}
        <VolunteerPicker
          selectedVolunteerName={selectedVolunteerName}
          onSelectVolunteer={setSelectedVolunteerName}
        />

        {/* Volunteer‐Specific Section */}
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
          <ScrollView>
            <Text className="text-xl font-bold text-blue-800 mb-2 text-right">
              {`סטטיסטיקות: ${selectedVolunteerName}`}
            </Text>

            {volunteerData.volunteerStats.map((vol: VolunteerStats) => (
              <VolunteerCard key={vol.id} volunteer={vol} />
            ))}
          </ScrollView>
        ) : (
          <View className="bg-white rounded-lg p-4 shadow-sm items-center">
            <Text className="text-gray-500 text-right">לא נמצאו נתונים בטווח הזמן הנבחר</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}