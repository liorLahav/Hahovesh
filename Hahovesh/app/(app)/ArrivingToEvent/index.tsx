import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import AdressCard from "./AdressCard";
import EventDetailsCard from "./EventDetailsCard";
import PhoneCard from "./PhoneCard";
import ButtonsPanel from "./ButtonsPanel";
import Timer from "./Timer";
import JoinedAndArrivedCard from "./JoinedAndArrivedCard";
import { useEventContext } from "@/hooks/EventContext";
import { Event } from "@/services/events";

const ArrivingToEventScreen = () => {
  const { event, refreshEvent } = useEventContext();

  useEffect(() => {
    refreshEvent();
  }, []);

  return (
    <>
      {event && (
        <SafeAreaView style={tw`flex-1 bg-blue-200`}>
          <ScrollView style={tw`flex-1`}>
            {/* Top red line */}
            <View style={tw`w-full h-1 bg-red-500 rounded-t-xl`} />

            {/* Header */}
            <View style={tw`bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-2xl shadow-sm`}>
              <View style={tw`flex-row items-center justify-center mb-2`}>
                <Text style={tw`text-2xl font-bold text-blue-700`}>{event?.medical_code}</Text>
              </View>
            </View>

            {/* Timer */}
            <Timer time={event?.createdAt || Date.now()} />

            {/* Address Tag */}
            {event?.street && (
              <AdressCard
                address={event.street}
                addressType={event.location_type}
                apartment_details={event.apartment_details}
              />
            )}

            {/* Joined & Arrived Stats */}
            <JoinedAndArrivedCard event={event as Event} />

            {/* Event Details */}
            <EventDetailsCard event={event as Event} />

            {/* Phone Numbers */}
            {event?.phone_number1 && <PhoneCard phone={event.phone_number1} />}
            {event?.phone_number2 && <PhoneCard phone={event.phone_number2} />}

            {/* Action Buttons */}
            <ButtonsPanel />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ArrivingToEventScreen;
