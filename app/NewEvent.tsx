
import { ScrollView, Text, Alert, View } from 'react-native';
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
    <View className="flex-1 bg-white">
       <View className="bg-blue-700 py-5 rounded-b-3xl shadow-md items-center justify-center">
        <Text className="text-3xl font-bold text-white tracking-wide">טופס אירוע</Text>
        <View className="w-16 h-1 bg-white mt-2 rounded-full" /> 
    </View>
    
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <Text className="text-2xl font-bold mb-6 text-right text-blue-700"> {/* פה שיניתי */}
          פרטי האירוע
        </Text>

      <DynamicForm schema={formSchema} onSubmit={handleSubmit} />
    </ScrollView>
    </View>
  );
}
