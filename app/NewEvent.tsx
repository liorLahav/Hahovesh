
import { ScrollView, Text, Alert } from 'react-native';
import { ref, push, set, serverTimestamp } from 'firebase/database';

import { realtimeDb } from '../FirebaseConfig';
import formSchema from '../data/formSchema';
import DynamicForm from '../components/DynamicForm';

export default function NewEventScreen() {
  /** Push a new event object to RTDB */
  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const node = push(ref(realtimeDb, 'events'));

      await set(node, {
        ...values,
        createdAt: serverTimestamp(),
      });

      console.log('✅ Saved event:', values);
      Alert.alert('Success', 'Event saved to database ✅');
    } catch (err: any) {
      console.error('❌ RTDB error:', err);
      Alert.alert('Error', err?.message ?? 'Could not save the event');
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
        טופס אירוע
      </Text>

      <DynamicForm schema={formSchema} onSubmit={handleSubmit} />
    </ScrollView>
  );
}
