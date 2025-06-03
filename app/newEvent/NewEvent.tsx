
import { ScrollView, Text, Alert, View } from 'react-native';

import formSchema from '../../data/formSchema';
import DynamicForm from '../../components/DynamicForm';
import { useState } from 'react';
import { createEvent } from '@/services/events';
import {router} from 'expo-router';

import HomePageHeader from "../home/HomePageHeader";

export default function NewEventScreen() {
  const [formKey, setFormKey] = useState(0);   
  /** Push a new event object to RTDB */
  const onSubmit = async (values: Record<string, string>) => {
    createEvent(values, () => setFormKey(k => k + 1)).then(() => {
      console.log('Event created successfully');
    }).catch((error: any) => {
      Alert.alert(
        'Error saving the event',
        error.message || 'Unexpected error event',
      );
    });
  }

  return (
    <View className="flex-1 bg-white">
       <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text className="text-3xl font-bold text-white tracking-wide">טופס אירוע</Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" /> 
    </View>
    
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text className="text-2xl font-bold mb-6 text-right text-blue-700">
          פרטי האירוע
        </Text>

      <DynamicForm key={formKey} schema={formSchema} onSubmit={onSubmit} />
    </ScrollView>
    </View>
  );
}
