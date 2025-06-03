import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';

type TimerProps = {
    time: string | number;
}

const Timer = (props: TimerProps) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const eventTimestampRef = useRef<number>(0);
    
    // Parse the time prop to get a timestamp
    const getTimestamp = (timeInput: string | number): number => {
        if (typeof timeInput === 'number' && !isNaN(timeInput)) {
            return timeInput;
        } else if (typeof timeInput === 'string') {
            // Try to parse as ISO date string
            const dateObj = new Date(timeInput);
            if (!isNaN(dateObj.getTime())) {
                return dateObj.getTime();
            }
        }
        // Return current time as fallback
        return new Date().getTime();
    };
    
    // Initialize the event timestamp when the component mounts or time prop changes
    useEffect(() => {
        try {
            eventTimestampRef.current = getTimestamp(props.time);
            
            // Calculate initial elapsed time
            updateElapsedTime();
        } catch (error) {
            console.error("Error setting event timestamp:", error);
            eventTimestampRef.current = new Date().getTime();
        }
    }, [props.time]);
    
    // Update elapsed time function
    const updateElapsedTime = () => {
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - eventTimestampRef.current) / 1000);
        setElapsedTime(elapsedSeconds > 0 ? elapsedSeconds : 0);
    };
    
    // Set up interval to update elapsed time
    useEffect(() => {
        // Update immediately first
        updateElapsedTime();
        
        // Then set interval for regular updates
        const intervalId = setInterval(updateElapsedTime, 1000);
        
        // Clean up on unmount
        return () => clearInterval(intervalId);
    }, []);
    
    // Format seconds to HH:MM:SS
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) seconds = 0;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-md overflow-hidden border border-gray-200 h-28 flex items-center justify-center">
            <View className="flex items-center justify-center">
                <Text className="text-gray-500 font-medium mb-2"> זמן שחלף מאז יצירת האירוע </Text>
                <Text className="text-3xl font-bold text-blue-600">{formatTime(elapsedTime)}</Text>
            </View>
        </View>
    );
};

export default Timer;