// src/dateRangeSelector.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StatsPeriod } from "./volApi";

interface DateRangePickerProps {
  period: StatsPeriod;
  setPeriod: (period: StatsPeriod) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
}

export default function DateRangePicker({
  period,
  setPeriod,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const periods: { key: StatsPeriod; label: string }[] = [
    { key: "daily", label: "יומי" },
    { key: "weekly", label: "שבועי" },
    { key: "monthly", label: "חודשי" },
    { key: "yearly", label: "שנתי" },
    { key: "all", label: "הכל" },
    { key: "custom", label: "מותאם" },
  ];

  const handlePeriodChange = (newPeriod: StatsPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== "custom") {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const onConfirmStart = (date: Date) => {
    setShowStartPicker(false);
    setStartDate(date);
    // If endDate is before the new startDate, clear endDate
    if (endDate && date.getTime() > endDate.getTime()) {
      setEndDate(undefined);
    }
  };

  const onCancelStart = () => {
    setShowStartPicker(false);
  };

  const onConfirmEnd = (date: Date) => {
    setShowEndPicker(false);
    setEndDate(date);
    // If startDate is after the new endDate, clear startDate
    if (startDate && date.getTime() < startDate.getTime()) {
      setStartDate(undefined);
    }
  };

  const onCancelEnd = () => {
    setShowEndPicker(false);
  };

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-blue-800 mb-3 text-right">
        בחירת טווח זמן
      </Text>

      {/* Period selector buttons */}
      <View className="flex-row flex-wrap justify-end mb-3">
        {periods.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => handlePeriodChange(item.key)}
            className={`mx-1 my-1 px-4 py-2 rounded-full ${
              period === item.key ? "bg-blue-700" : "bg-gray-200"
            }`}
          >
            <Text
              className={`${
                period === item.key ? "text-white" : "text-gray-800"
              } font-medium`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {period === "custom" && (
        <View>
          {/* End Date Picker button (left) */}
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className="flex-1 bg-white border border-gray-300 rounded-md p-2"
            >
              <Text className="text-right text-gray-700">
                {endDate
                  ? endDate.toLocaleDateString("he-IL")
                  : "בחר תאריך סיום"}
              </Text>
            </TouchableOpacity>

            <Text className="mx-2 text-gray-700 font-medium">עד</Text>

            {/* Start Date Picker button (right) */}
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="flex-1 bg-white border border-gray-300 rounded-md p-2"
            >
              <Text className="text-right text-gray-700">
                {startDate
                  ? startDate.toLocaleDateString("he-IL")
                  : "בחר תאריך התחלה"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Start DateTimePickerModal */}
          <DateTimePickerModal
            isVisible={showStartPicker}
            mode="date"
            onConfirm={onConfirmStart}
            onCancel={onCancelStart}
            maximumDate={endDate || undefined}
            // Use title instead of headerTextIOS for cross-platform support
            title="בחר תאריך התחלה"
            confirmTextIOS="אישור" 
            cancelTextIOS="ביטול"
          />

          {/* End DateTimePickerModal */}
          <DateTimePickerModal
            isVisible={showEndPicker}
            mode="date"
            onConfirm={onConfirmEnd}
            onCancel={onCancelEnd}
            minimumDate={startDate || undefined}
            // Use title instead of headerTextIOS for cross-platform support
            title="בחר תאריך סיום"
            confirmTextIOS="אישור"
            cancelTextIOS="ביטול"
          />
        </View>
      )}
    </View>
  );
}
