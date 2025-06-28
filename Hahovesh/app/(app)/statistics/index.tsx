import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainVolunteerStats from './volStatsScreen';

export default function StatisticsScreen() {
  return (
    <SafeAreaView className="flex-1 ">
      <MainVolunteerStats />
    </SafeAreaView>
  );
}