import { Modal, View, Text, TextInput, Pressable } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";

const PICKER_FIELDS: Record<string, string[]> = {
  location_type: ["מקום ציבורי", "בית", "בית כנסת", "בית ספר", "רחוב"],
  urgency: ["חובש בלבד", "אמבולנס", "אמבולנס דחוף", "אמבולנס טיפול נמרץ"],
  recipient: ["מגן דוד אדום", "איחוד הצלה", "החובש"],
  haznk_code: ["מחלה מבוגר", "מחלה ילד"],
  patient_sex: ["זכר", "נקבה"],
  informat_location: ["במקום", "מודיע צד ג"],
};

type Props = {
  visible: boolean;
  fieldLabel: string | null;
  editedValue: string;
  fieldKey: string | null;
  onChange: (val: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function EditModal({
  visible,
  fieldLabel,
  editedValue,
  onChange,
  onCancel,
  onSave,
  fieldKey,
}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    console.log("aaaaaaaaaaa", fieldKey);
    if (fieldKey && PICKER_FIELDS[fieldKey]) {
      setItems(
        PICKER_FIELDS[fieldKey].map((opt) => ({ label: opt, value: opt }))
      );
    }
  }, [fieldKey]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white w-[90%] p-5 rounded-2xl shadow-lg">
          <Text className="text-center text-lg font-bold mb-4 text-blue-900">
            ערוך {fieldLabel}
          </Text>

          {fieldKey && PICKER_FIELDS[fieldKey] ? (
            <DropDownPicker
              open={open}
              value={editedValue}
              items={items}
              setOpen={setOpen}
              setValue={(cb) => onChange(cb(editedValue))}
              setItems={setItems}
              textStyle={{ textAlign: "right" }}
              placeholder={`בחר ${fieldLabel}`}
              zIndex={1000}
              style={{ marginBottom: open ? 200 : 10 }}
            />
          ) : (
            <TextInput
              value={editedValue}
              onChangeText={onChange}
              className="border border-blue-200 p-3 rounded-md text-right"
            />
          )}

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
