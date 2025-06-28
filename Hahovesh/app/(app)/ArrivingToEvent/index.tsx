import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, useRef, use } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AdressCard from "./AdressCard";
import EventDetailsCard from "./EventDetailsCard";
import PhoneCard from "./PhoneCard";
import { Button } from "@/components/Button";
import ButtonsPanel from "./ButtonsPanel";
import { Event } from "@/services/events";
import { useEventContext } from "@/hooks/EventContext";
import Timer from "./Timer";
import JoinedAndArrivedCard from "./JoinedAndArrivedCard";

const ArrivingToEventScreen = () => {
  const { event, refreshEvent } = useEventContext();

  useEffect(() => {
    refreshEvent();
  }, []);

  return (
    <>
      {event && (
        <SafeAreaView className="flex-1 bg-blue-200">
          <ScrollView className="flex-1">
            {/* Top red line */}
            <View className="w-full h-1 bg-red-500 rounded-t-xl" />

            {/* Header */}
            <View className="bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-2xl shadow-sm">
              <View className="flex-row items-center justify-center mb-2">
                <Text className="text-2xl font-bold text-blue-700">
                  {event?.anamnesis}
                </Text>
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
            {event && <JoinedAndArrivedCard event={event} />}
            {event && <EventDetailsCard event={event} />}
            {event?.phone_number1 && <PhoneCard phone={event.phone_number1} />}
            {event?.phone_number2 && <PhoneCard phone={event.phone_number2} />}
            <ButtonsPanel />
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ArrivingToEventScreen;
