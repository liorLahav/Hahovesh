import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainVolunteerStats from './volStatsScreen';
import tw from "twrnc";

export default function StatisticsScreen() {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <MainVolunteerStats />
    </SafeAreaView>
  );
}