import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState, useRef, use } from 'react';
import { View, Text, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdressCard from './AdressCard';
import EventDetailsCard from './EventDetailsCard';
import PhoneCard from './PhoneCard';
import { Button } from '@/components/Button';
import ButtonsPanel from './ButtonsPanel';
import { Event } from '@/services/events';
import {useEventContext} from "@/hooks/EventContext";
import Timer from './Timer';
import MenuButton from '@/components/navigation/menuButton';



const ArrivingToEventScreen = () => {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { event ,refreshEvent} = useEventContext();

  useEffect(() => {
      refreshEvent()
  }, []);


  return (
    <>
      {event && (
        <SafeAreaView className="flex-1 bg-blue-200">
          <ScrollView className="flex-1" >
          {/* Top red line */}
          <View className="w-full h-1 bg-red-500 rounded-t-xl" />
          
          {/* Header */}
          <View className="w-full bg-blue-100 shadow-sm p-2 rounded-b-md">
            <View className="flex-row-reverse items-center justify-center mb-2">
              <Text className="text-2xl font-bold text-blue-700">אירוע</Text>
            </View>
          </View>

          {/* Main content */}
          <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
            <Text className="text-3xl font-bold text-white tracking-wide">
              {event?.anamnesis || ''}
            </Text>
            <View className="w-16 h-1 bg-white mt-2 rounded-full" />
          </View>
          
          {/* Timer */}
          <Timer time={event?.createdAt || Date.now()}/>
          {/* Address Tag */}
          {event?.street && <AdressCard address={event.street} addressType={event.location_type} apartment_details={event.apartment_details}/>}
          {event && <EventDetailsCard event={event} />}
          {event?.phone_number1 && <PhoneCard phone={event.phone_number1} />}
          {event?.phone_number2 && <PhoneCard phone={event.phone_number2} />}
          <ButtonsPanel/>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ArrivingToEventScreen;