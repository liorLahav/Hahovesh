import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import EditableDetailRow from '../detailedEvent/EditableDetailRow';
import { FIELD_LABELS, READ_ONLY_KEYS } from './fields';
import { formatValue } from './format';
import {
  getEventSummary,
  updateEventSummary,
  EventSummary,
} from '@/services/event_summary';

/* ---------- Header ---------- */
const EditHeader = () => {
  const router = useRouter();
  return (
    <>
      <View className="w-full h-1 bg-red-500" />
      <View className="bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-2xl shadow-sm">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.replace('/summaryReports')}>
            <Ionicons name="arrow-back" size={28} color="#1e3a8a" />
          </Pressable>
          <Text className="text-xl font-bold text-blue-800">עריכת דוח</Text>
          <View style={{ width: 35 }} />
        </View>
      </View>
    </>
  );
};

/* ---------- Modal ---------- */
const EditModal = ({
  visible,
  fieldLabel,
  editedValue,
  onChange,
  onCancel,
  onSave,
}: {
  visible: boolean;
  fieldLabel: string | null;
  editedValue: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 bg-black/40 justify-center items-center">
      <View className="bg-white w-[90%] p-5 rounded-2xl shadow-lg">
        <Text className="text-center text-lg font-bold mb-4 text-blue-900">
          ערוך {fieldLabel}
        </Text>
        <TextInput
          value={editedValue}
          onChangeText={onChange}
          className="border border-blue-200 p-3 rounded-md text-right"
          placeholder="ערך חדש…"
        />
        <View className="flex-row justify-center gap-4 mt-6">
          <Pressable
            onPress={onCancel}
            className="bg-red-600 px-6 py-2 rounded-full shadow"
          >
            <Text className="text-white font-bold">ביטול</Text>
          </Pressable>
          <Pressable
            onPress={onSave}
            className="bg-green-600 px-6 py-2 rounded-full shadow"
          >
            <Text className="text-white font-bold">שמור</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

/* ---------- Main ---------- */
export default function SummaryEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [docData, setDocData] = useState<EventSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [fieldKey, setFieldKey] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  /* fetch once */
  useEffect(() => {
    (async () => {
      const data = await getEventSummary(id);
      setDocData(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>טוען דוח…</Text>
      </SafeAreaView>
    );
  if (!docData)
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>הדוח לא נמצא</Text>
      </SafeAreaView>
    );

  const editableKeys = Object.keys(FIELD_LABELS).filter(
    (k) => !(READ_ONLY_KEYS as readonly string[]).includes(k),
  );

  const details = editableKeys.map((k) => ({
    key: k,
    label: FIELD_LABELS[k],
    raw: docData[k] ?? '',
    formatted: formatValue(k, docData[k]),
  }));

  const save = async () => {
    if (!fieldKey) return;
    await updateEventSummary(docData.id, { [fieldKey]: draft });
    router.replace('/summaryReports');       // חזרה + רענון בליסטה
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <StatusBar barStyle="dark-content" />
      <EditHeader />

      <ScrollView className="px-6 py-4">
        {details.map((d) => (
          <EditableDetailRow
            key={d.key}
            label={d.label}
            value={String(d.formatted)}
            canEdit
            onEdit={() => {
              setFieldKey(d.key);
              setDraft(String(d.raw));
              setModalOpen(true);
            }}
          />
        ))}
      </ScrollView>

      <EditModal
        visible={modalOpen}
        fieldLabel={fieldKey ? FIELD_LABELS[fieldKey] : null}
        editedValue={draft}
        onChange={setDraft}
        onCancel={() => setModalOpen(false)}
        onSave={save}
      />
    </SafeAreaView>
  );
}
