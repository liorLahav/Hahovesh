import { View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import tw from 'twrnc';

type Props = {
  label: string;
  value: string;
  canEdit: boolean;
  onEdit: () => void;
};

export default function EditableDetailRow({ label, value, canEdit, onEdit }: Props) {
  return (
    <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
      <Text style={tw`text-sm text-gray-500 text-right`}>{label}</Text>
      <Text style={tw`text-lg text-right text-gray-800`}>{value || "-"}</Text>

      {canEdit && (
        <View style={tw`absolute`}>
          <Pressable
            onPress={onEdit}
            style={tw`bg-blue-100 p-2 rounded-full shadow-sm h-[40px] w-[80px] items-center flex-row gap-1`}
          >
            <View style={tw`flex-row items-center gap-1`}>
              <Ionicons name="create-outline" size={18} color="black" />
              <Text>עריכה</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}