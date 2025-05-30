import { Modal, View, Text, TextInput, Pressable } from "react-native";

type Props = {
  visible: boolean;
  fieldLabel: string | null;
  editedValue: string;
  onChange: (val: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function EditModal({ visible, fieldLabel, editedValue, onChange, onCancel, onSave }: Props) {
  return (
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
          />

          <View className="flex-row justify-center gap-4 mt-6">
            <Pressable
              onPress={onCancel}
              className="bg-red-600 px-6 py-2 rounded-full shadow"
            >
              <Text className="text-white font-bold text-base">ביטול</Text>
            </Pressable>

            <Pressable
              onPress={onSave}
              className="bg-green-600 px-6 py-2 rounded-full shadow"
            >
              <Text className="text-white font-bold text-base">שמור</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
