import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

type TimerProps = {
  time: string | number;
};

const Timer = (props: TimerProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const eventTimestampRef = useRef<number>(0);

  // Parse the time prop to get a timestamp
  const getTimestamp = (timeInput: string | number): number => {
    if (typeof timeInput === "number" && !isNaN(timeInput)) {
      return timeInput;
    } else if (typeof timeInput === "string") {
      const dateObj = new Date(timeInput);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.getTime();
      }
    }
    // Fallback to now
    return Date.now();
  };

  // Initialize timestamp on mount or when time prop changes
  useEffect(() => {
    try {
      eventTimestampRef.current = getTimestamp(props.time);
      updateElapsedTime();
    } catch (error) {
      console.error("Error setting event timestamp:", error);
      eventTimestampRef.current = Date.now();
    }
  }, [props.time]);

  // Update elapsed time
  const updateElapsedTime = () => {
    const now = Date.now();
    const seconds = Math.floor((now - eventTimestampRef.current) / 1000);
    setElapsedTime(seconds > 0 ? seconds : 0);
  };

  // Start interval to update every second
  useEffect(() => {
    updateElapsedTime();
    const id = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(id);
  }, []);

  // Format HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs]
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <View style={tw`bg-white mx-4 mt-4 rounded-xl shadow-md overflow-hidden border border-gray-200 h-28 flex items-center justify-center`}>
      <View style={tw`flex items-center justify-center`}>
        <Text style={tw`text-gray-500 font-medium mb-2`}>זמן שחלף מאז יצירת האירוע</Text>
        <Text style={tw`text-3xl font-bold text-blue-600`}>{formatTime(elapsedTime)}</Text>
      </View>
    </View>
  );
};

export default Timer;
