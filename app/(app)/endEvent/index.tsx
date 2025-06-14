import { useState, useEffect } from 'react';
import { ScrollView, Text, Alert, View, ActivityIndicator } from 'react-native';
import DynamicForm from '@/components/DynamicForm';
import formSchema_eventSummary from '@/data/fromSchema_eventSummary';
import { saveEventSummary } from '@/services/event_summary';
import { useEventContext } from '@/hooks/EventContext';
import { router } from 'expo-router';
import { deleteEventById } from '@/services/events';
import EventSummaryHeader from './EventSummaryHeader';
import { useUserContext } from '@/hooks/UserContext';

export default function EventSummaryScreen() {
  const [formKey, setFormKey] = useState(0);
  const [initialValues, setInitialValues] = useState<Record<string, string> | null>(null);
  const { event, changeActiveStatus } = useEventContext();
  const { user } = useUserContext();

  useEffect(() => {
    const mappedValues: Record<string, string> = {
      name: event.patient_name ?? '',
      gender: event.patient_sex ?? '',
      address: event.apartment_details ?? '',
      event_address: event.street ?? '',
      medical_code: event.medical_code ?? '',
      receiver: event.recipient ?? '',
      event_location: event.location_type ?? '',
      event_date: event.createdAt
        ? new Date(event.createdAt).toLocaleDateString('he-IL')
        : '',
        volenteer_id: user.id,
    };

    setInitialValues(mappedValues);
  }, [event]);

  const onSubmit = async (values: Record<string, string>) => {
  try {
    await saveEventSummary({ ...values, eventId: event.id });

    await deleteEventById(event.id);

    changeActiveStatus(false);

    Alert.alert('הצלחה', 'דוח הסיכום נשלח ונשמר בהצלחה');

    setTimeout(() => {
      router.replace('/home');
    }, 3000);

    setFormKey(k => k + 1);
  } catch (err: any) {
    Alert.alert('שגיאה', err.message || 'שגיאה בלתי צפויה בשליחת הדוח');
  }
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
    <EventSummaryHeader />

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