import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatsPeriod } from './volApi'; // Import statistics period type definition

/**
 * Props interface for the DateRangePicker component
 */
interface DateRangePickerProps {
  period: StatsPeriod;              // Currently selected time period
  setPeriod: (period: StatsPeriod) => void;  // Function to update period
  startDate: Date | undefined;      // Start date for custom range
  setStartDate: (date: Date | undefined) => void;  // Function to update start date
  endDate: Date | undefined;        // End date for custom range
  setEndDate: (date: Date | undefined) => void;    // Function to update end date
}

export default function DateRangePicker({
  period,setPeriod,startDate,setStartDate,endDate,setEndDate,}: DateRangePickerProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
    // Define available time periods with their display labels (in Hebrew)
  const periods: { key: StatsPeriod; label: string }[] = [
    { key: 'daily', label: 'יומי' },     // Daily
    { key: 'weekly', label: 'שבועי' },   // Weekly
    { key: 'monthly', label: 'חודשי' },  // Monthly
    { key: 'yearly', label: 'שנתי' },    // Yearly
    { key: 'all', label: 'הכל' },        // All time
    { key: 'custom', label: 'מותאם' },   // Custom date range
  ];
    const handlePeriodChange = (newPeriod: StatsPeriod) => {
    setPeriod(newPeriod);
    
    // Reset custom date range if not in 'custom' mode
    if (newPeriod !== 'custom') {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };
  
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };
    return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      {/* Date Range Selection Title */}
      <Text className="text-lg font-bold text-blue-800 mb-3 text-right">
        בחירת טווח זמן
      </Text>
        {/* Period selection buttons (daily, weekly, monthly, etc.) */}
      <View className="flex-row flex-wrap justify-end mb-3">
        {periods.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => handlePeriodChange(item.key)}
            className={`mx-1 my-1 px-4 py-2 rounded-full ${
              period === item.key ? 'bg-blue-700' : 'bg-gray-200'
            }`}
          >
            <Text
              className={`${
                period === item.key ? 'text-white' : 'text-gray-800'
              } font-medium`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
        {/* Custom date range picker (shown only when 'custom' period is selected) */}
      {period === 'custom' && (
        <View>
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="flex-1 bg-white border border-gray-300 rounded-md p-2"
            >
              <Text className="text-right">
                {startDate ? startDate.toLocaleDateString('he-IL') : 'בחר תאריך התחלה'}
              </Text>
            </TouchableOpacity>
            
            <Text className="mx-2">עד</Text>
            
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className="flex-1 bg-white border border-gray-300 rounded-md p-2"
            >
              <Text className="text-right">
                {endDate ? endDate.toLocaleDateString('he-IL') : 'בחר תאריך סיום'}
              </Text>
            </TouchableOpacity>
          </View>
            {/* Start date picker (conditionally shown) */}
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
            />
          )}
          
          {/* End date picker (conditionally shown) */}
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
              minimumDate={startDate || undefined}
            />
          )}
        </View>
      )}
    </View>
  );
}