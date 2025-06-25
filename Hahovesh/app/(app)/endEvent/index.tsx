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
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateStatus } from '@/services/users';
import VolunteerCard from '../statistics/volCard';
import { updateFinishedEventsCount } from '@/services/globalStatsService';

export default function EventSummaryScreen() {
  const [formKey, setFormKey] = useState(0);
  const [initialValues, setInitialValues] = useState<Record<string, string> | null>(null);
  const { event, changeActiveStatus } = useEventContext();
  const { user,setIsAvailable } = useUserContext();

  useEffect(() => {
    console.log(event.volunteers);
    const mappedValues: Record<string, string> = {
      name: event.patient_name ?? '',
      gender: event.patient_sex ?? '',
      address: event.apartment_details ?? '',
      event_address: event.street ?? '',
      medical_code: event.medical_code ?? '',
      receiver: event.recipient ?? '',
      event_location: event.location_type ?? '',
      event_date: event.createdAt
        ? Math.floor(new Date(event.createdAt).getTime() / 1000).toString()
        : Math.floor(Date.now() / 1000).toString(),
    };

    setInitialValues(mappedValues);
  }, [event]);

  const onSubmit = async (values: Record<string, string>) => {
  try {
    console.log('Submitting event summary with values:', user.id);
    await saveEventSummary({ ...values, eventId: event.id,volunteer_times : event.volunteers,
      volenteer_id: user.id,
    });

    await deleteEventById(event.id);
    await updateStatus(user.id, 'available');
    await updateFinishedEventsCount(user.id,true);
    setIsAvailable(true);

    changeActiveStatus(false);

    Alert.alert('הצלחה', 'דוח הסיכום נשלח ונשמר בהצלחה');
    router.replace('/home');
    setFormKey(k => k + 1);
  } catch (err: any) {
    console.error('Error saving event summary:', err);
    Alert.alert('שגיאה', 'לא ניתן לשמור את דוח הסיכום, אנא פנה למנהל');
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
  <SafeAreaView className="flex-1 bg-white">
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
  </SafeAreaView>
);
}