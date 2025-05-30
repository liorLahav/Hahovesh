import React from 'react';
import { View, Text } from 'react-native';

interface StatsSummaryProps {
  totalEvents: number;
  activeVolunteers: number;
}

export default function StatsSummary({
  totalEvents,
  activeVolunteers
}: StatsSummaryProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-blue-800 mb-3 text-right">
        סיכום כללי
      </Text>

      <View className="flex-row justify-between mb-2">
        <Text className="text-xl font-semibold">{totalEvents}</Text>
        <Text className="text-gray-700">סה״כ אירועים</Text>
      </View>

      <View className="flex-row justify-between">
        <Text className="text-xl font-semibold">{activeVolunteers}</Text>
        <Text className="text-gray-700">מתנדבים פעילים</Text>
      </View>
    </View>
  );
}
