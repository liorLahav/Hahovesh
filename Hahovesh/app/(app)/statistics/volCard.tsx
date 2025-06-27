import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { VolunteerStats } from "../../../services/volunteerAnalyticsService";
import { Ionicons } from '@expo/vector-icons';

interface VolunteerCardProps {
  volunteer: VolunteerStats;
}

export default function VolunteerCard({ volunteer }: VolunteerCardProps) {
  const [showEvents, setShowEvents] = useState(false);
  console.log("Rendering VolunteerCard for:", volunteer);

  // Helpers for form-quality display
  const getQualityColor = (q: number) => {
    if (q >= 8) return 'bg-green-500';
    if (q >= 6) return 'bg-yellow-500';
    if (q >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };
  const getQualityIcon = (q: number) => {
    if (q >= 8) return 'star';
    if (q >= 6) return 'thumbs-up';
    if (q >= 4) return 'alert-circle';
    return 'warning';
  };

  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      {/* Volunteer name */}
      <Text className="text-xl font-bold text-blue-800 mb-4 text-right">
        {volunteer.name}
      </Text>

      {/* Events count */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">{volunteer.eventsCount}</Text>
        <Text className="text-gray-700">אירועים:</Text>
      </View>

      {/* Summaries count */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold">{volunteer.summariesCount}</Text>
        <Text className="text-gray-700">סיכומים:</Text>
      </View>

      {/* Average response time */}
      {volunteer.responseTimeAvg > 0 && (
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold">
            {Math.round(volunteer.responseTimeAvg)} דקות
          </Text>
          <Text className="text-gray-700">זמן תגובה ממוצע:</Text>
        </View>
      )}

      {/* Form‐quality */}
      <View className="flex-row justify-between items-center pt-2 mt-2 mb-2 border-t border-gray-100">
        <View className={`px-3 py-1.5 rounded-full ${getQualityColor(volunteer.formQuality)} flex-row items-center`}>
          <Ionicons name={getQualityIcon(volunteer.formQuality)} size={16} color="white" style={{ marginRight: 5 }} />
          <Text className="text-white font-bold">{volunteer.formQuality.toFixed(1)}</Text>
        </View>
        <Text className="text-gray-700">איכות טפסים:</Text>
      </View>

      {/* Toggle events list */}
      {volunteer.events && volunteer.events.length > 0 && (
        <TouchableOpacity
          className="mt-2 pt-2 border-t border-gray-200 flex-row justify-between items-center"
          onPress={() => setShowEvents(!showEvents)}
        >
          <Text className="text-blue-600 font-medium">
            {showEvents ? 'הסתר אירועים' : 'הצג אירועים'}
          </Text>
          <Ionicons
            name={showEvents ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#2563EB"
          />
        </TouchableOpacity>
      )}

      {/* Events list */}
      {showEvents && volunteer.events && (
        <View className="mt-3 border-t border-gray-200 pt-3">
          {volunteer.events.map((e, i) => (
            <View key={e.eventId || i} className="mb-2 p-2 bg-gray-50 rounded border border-gray-100">
              <Text className="text-gray-800">
                {e.eventDate.toDate().toLocaleString('he-IL', {
                  day: 'numeric', month: 'numeric', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </Text>
              <Text className="text-gray-600 mt-1">מזהה אירוע: {e.eventId}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
