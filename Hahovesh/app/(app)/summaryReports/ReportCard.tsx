import { useEffect, useState } from "react";
import { View, Text, Pressable, LayoutAnimation } from "react-native";
import { useRouter } from "expo-router";
import { EventSummary } from "@/services/event_summary";

import { FIELD_LABELS, ORDERED_KEYS } from "./fields";
import { formatValue } from "./format";
import { getFirstVolunteerTimes } from "./volunteer";

import tw from "twrnc";

type Props = {
  item: EventSummary;
  isScreenFocused: boolean;
};

export default function ReportCard({ item, isScreenFocused }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const first = getFirstVolunteerTimes((item as any).volunteer_times);

  useEffect(() => {
    if (!isScreenFocused) {
      setOpen(false);
    }
  }, [isScreenFocused]);

  const details = ORDERED_KEYS.map((k) => {
    let raw: unknown = (item as any)[k];
    if (k === "departure_time") raw = first.joinedAt;
    if (k === "arrival_time") raw = first.arrivedAt;
    return { key: k, label: FIELD_LABELS[k], value: formatValue(k, raw) };
  });

  return (
    <Pressable
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        setOpen(!open);
      }}
      style={tw`mb-4 bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200`}
    >
      <View style={tw`flex-row-reverse justify-between items-center`}>
        <Text style={tw`text-md text-gray-500`}>
          {formatValue("event_date", (item as any).event_date)}
        </Text>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          {(item as any).medical_code ?? "ללא כותרת"}
        </Text>
      </View>

      {open && (
        <View style={tw`mt-3 space-y-1`}>
          {details.map(({ key, label, value }) => (
            <Text
              key={key}
              style={tw`text-right text-gray-800 text-lg leading-relaxed`}
            >
              <Text style={tw`font-semibold`}>{label}: </Text>
              {value}
            </Text>
          ))}

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/summaryReports/Edit",
                params: { id: item.id },
              })
            }
            style={tw`self-start mt-4 bg-blue-600 px-4 py-1.5 rounded-full`}
          >
            <Text style={tw`text-white text-sm font-bold`}>ערוך</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}
