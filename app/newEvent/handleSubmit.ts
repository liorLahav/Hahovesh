import { Alert } from 'react-native';
import { push, ref, set, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '../../FirebaseConfig';

/**
 * Pushes a new event to the Realtime Database,
 * shows alerts, and invokes a reset callback.
 */
export async function handleSubmit(
  values: Record<string, string>,
  onReset: () => void
): Promise<void> {
  try {
    const node = push(ref(realtimeDb, 'events'));
    await set(node, {
      ...values,
      createdAt: serverTimestamp(),
    });
    console.log('✅ Saved event:', values);
    Alert.alert('Success', 'Event saved to database ✅');
    onReset();
  } catch (err: any) {
    console.error('❌ RTDB error:', err);
    Alert.alert('Error', err?.message ?? 'Could not save the event');
  }
}