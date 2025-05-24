import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

type TimerProps = {
    time : number; 
}
const Timer = (props : TimerProps) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);

    // Start timer when component mounts
    useEffect(() => {
        let intervalId: number;
        
        if (isRunning) {
            intervalId = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        
        // Clean up interval on unmount
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isRunning]); 

    useEffect(() => {
        // Calculate elapsed seconds from timestamp to now
        if (typeof props.time === 'number' && !isNaN(props.time)) {
            const currentTime = new Date().getTime();
            const elapsedSeconds = Math.floor((currentTime - props.time) / 1000);
            setElapsedTime(elapsedSeconds > 0 ? elapsedSeconds : 0);
        } else {
            setElapsedTime(0);
        }
    }, [props.time]); 

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
                <Text className="text-gray-500 font-medium mb-2">זמן חלף מרגע הקבלה</Text>
                <Text className="text-3xl font-bold text-blue-600">{formatTime(elapsedTime)}</Text>
            </View>
        </View>
    );
};

export default Timer;