// volunteerStatsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useStatistics } from './useVolData';
import { StatsPeriod, VolunteerStats } from './volApi';
import DateRangePicker from './dateRangeSelector';
import VolunteerPicker from './volSelector';
import VolunteerCard from './volCard';
import StatsSummary from './statsSummary';
import UpdateHandler from './updateHandler';

export default function MainVolunteerStats() {
  const [period, setPeriod] = useState<StatsPeriod>('all');
  const [selectedVolunteerName, setSelectedVolunteerName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data, loading, error } = useStatistics(
    period,
    selectedVolunteerName || undefined,
    startDate,
    endDate
  );

  return (
    <SafeAreaView className="flex-1 bg-blue-100">
      {/* Header */}
      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text className="text-3xl text-white tracking-wide font-bold">סטטיסטיקות</Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" />
      </View>

      {/* Update button */}
      <View className="px-4 py-2 flex-row justify-end">
        <UpdateHandler />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Volunteer selector */}
        <VolunteerPicker
          selectedVolunteerName={selectedVolunteerName}
          onSelectVolunteer={setSelectedVolunteerName}
        />

        {/* Date-range */}
        <DateRangePicker
          period={period}
          setPeriod={setPeriod}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* No selection */}
        {!selectedVolunteerName && (
          <View className="bg-white rounded-lg p-6 shadow-sm items-center justify-center mt-4">
            <Ionicons name="people" size={60} color="#93c5fd" />
            <Text className="text-lg font-bold text-blue-800 mt-4 mb-2">
              בחר מתנדב כדי לצפות בסטטיסטיקות
            </Text>
            <Text className="text-gray-500 text-center">
              בחר מתנדב מהרשימה למעלה כדי לראות את הסטטיסטיקות שלו
            </Text>
          </View>
        )}

        {/* Loading */}
        {selectedVolunteerName && loading && (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" color="#1d4ed8" />
            <Text className="mt-4 text-blue-800 text-lg">טוען נתונים...</Text>
          </View>
        )}

        {/* Error */}
        {selectedVolunteerName && error && (
          <View className="bg-red-50 p-4 rounded-lg border border-red-200 items-center my-4">
            <Text className="text-red-700 text-lg font-bold mb-2">שגיאה</Text>
            <Text className="text-red-600">{error}</Text>
          </View>
        )}

        {/* Data */}
        {selectedVolunteerName && !loading && !error && data && (
          <>
            {/* ← only these two props now */}
            <StatsSummary
              totalEvents={data.totalEvents}
              activeVolunteers={data.volunteerStats.length}
            />

            <Text className="text-xl font-bold text-blue-800 mb-2 text-right">
              {`סטטיסטיקות: ${selectedVolunteerName}`}
            </Text>

            {data.volunteerStats.length === 0 ? (
              <View className="bg-white rounded-lg p-4 shadow-sm items-center">
                <Text className="text-gray-500">
                  לא נמצאו נתונים בטווח הזמן הנבחר
                </Text>
              </View>
            ) : (
              data.volunteerStats.map((vol) => (
                <VolunteerCard key={vol.id} volunteer={vol} />
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
