import { useState } from 'react';
import { View, Text, Pressable, LayoutAnimation } from 'react-native';
import { useRouter } from 'expo-router';
import { EventSummary } from '@/services/event_summary';

import { FIELD_LABELS, ORDERED_KEYS } from './fields';
import { formatValue } from './format';
import { getFirstVolunteerTimes } from './volunteer';

export default function ReportCard({ item }: { item: EventSummary }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const first = getFirstVolunteerTimes((item as any).volunteer_times);

  const details = ORDERED_KEYS.map((k) => {
    let raw: unknown = (item as any)[k];
    if (k === 'departure_time') raw = first.joinedAt;
    if (k === 'arrival_time')   raw = first.arrivedAt;
    return { key: k, label: FIELD_LABELS[k], value: formatValue(k, raw) };
  });

  return (
    <Pressable
      onPress={() => { LayoutAnimation.easeInEaseOut(); setOpen(!open); }}
      className="mb-4 bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200"
    >
      <View className="flex-row-reverse justify-between items-center">
        <Text className="text-sm text-gray-500">
          {formatValue('event_date', (item as any).event_date)}
        </Text>
        <Text className="text-sm font-bold text-gray-800">
          {(item as any).title_event ?? 'ללא כותרת'}
        </Text>
      </View>

      {open && (
        <View className="mt-3 space-y-1">
          {details.map(({ key, label, value }) => (
            <Text key={key} className="text-right text-gray-800">
              <Text className="font-semibold">{label}: </Text>
              {value}
            </Text>
          ))}

          <Pressable
            onPress={() => router.push({ pathname: '/summaryReports/Edit', params: { id: item.id } })}
            className="self-start mt-4 bg-blue-600 px-4 py-1.5 rounded-full"
          >
            <Text className="text-white text-sm font-bold">ערוך</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}
