import { useState, useEffect } from 'react';
import { ScrollView, Text, Alert, View, ActivityIndicator } from 'react-native';
import DynamicForm from '@/components/DynamicForm';
import formSchema_eventSummary from '@/data/fromSchema_eventSummary';
import { saveEventSummary, loadInitialValuesFromRealtime } from '@/services/event_summary';
import HomePageHeader from '../home/HomePageHeader';

interface Props {
  route: {
    params: {
      eventId: string;
    };
  };
}

export default function EventSummaryScreen({ route }: Props) {
  const { eventId } = route.params;
  const [formKey, setFormKey] = useState(0);
  const [initialValues, setInitialValues] = useState<Record<string, string> | null>(null);

 useEffect(() => {
  (async () => {
    const { initialValues } = await loadInitialValuesFromRealtime(eventId);
    console.log('Initial values loaded:', initialValues);
    setInitialValues(initialValues);
  })();
}, [eventId]);

  const onSubmit = async (values: Record<string, string>) => {
    saveEventSummary({ ...values, eventId })
      .then(() => {
        console.log('Event summary saved successfully');
        setFormKey(k => k + 1);
      })
      .catch((error: any) => {
        Alert.alert(
          'Error saving the event summary',
          error.message || 'Unexpected error summary',
        );
      });
  };

  if (!initialValues) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <HomePageHeader />
      <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text className="text-3xl font-bold text-white tracking-wide">דוח סיכום</Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-2xl font-bold mb-6 text-right text-blue-700">
          פרטי הסיכום
        </Text>

     <DynamicForm
        key={formKey}
        schema={formSchema_eventSummary}
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
      </ScrollView>
    </View>
  );
}