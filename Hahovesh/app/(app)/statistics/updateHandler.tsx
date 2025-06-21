import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { triggerStatisticsUpdate } from './volStatsUpdater';
import { Ionicons } from '@expo/vector-icons';

/**
 * A reusable component for updating volunteer statistics
 * This can be added to any page that needs to trigger statistics updates
 */
export default function UpdateHandler() {
  const [updating, setUpdating] = useState(false);
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setResult(null);

      console.log('Starting statistics update from Update Handler...');
      const updateResult = await triggerStatisticsUpdate();
      
      setResult({
        success: true,
        message: `עודכנו נתונים עבור ${updateResult.volunteersUpdated} מתנדבים!`
      });

      // Hide the message after 5 seconds
      setTimeout(() => setResult(null), 5000);
    } catch (error) {
      console.error('Error updating statistics from handler:', error);
      setResult({
        success: false, 
        message: `שגיאה בעדכון הנתונים: ${error instanceof Error ? error.message : 'שגיאה לא ידועה'}`
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View className="p-2">
      <TouchableOpacity
        className={`flex-row items-center p-2 rounded-lg ${updating ? 'bg-gray-400' : 'bg-green-600'}`}
        onPress={handleUpdate}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Text className="text-white font-medium mr-2">עדכן נתוני מתנדבים</Text>
            <Ionicons name="sync" size={18} color="white" />
          </>
        )}
      </TouchableOpacity>
      
      {result && (
        <View className={`mt-2 p-2 rounded-md ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`${result.success ? 'text-green-800' : 'text-red-800'} text-right`}>
            {result.message}
          </Text>
        </View>
      )}
    </View>
  );
}
