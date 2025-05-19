import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

/** Option type */
type Option = { label: string; value: string };

/** Props for Select component */
interface Props {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}

/** Unified Select component styled with Tailwind */
export default function Select({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label ?? 'בחר';

  return (
    <View className="border border-blue-300 rounded-lg bg-blue-50 px-3 py-2">
      {/* Selected value (header) */}
      <Pressable onPress={() => setOpen(prev => !prev)}>
        <Text className="text-right text-gray-800">
          {selectedLabel}
        </Text>
      </Pressable>

      {/* List of options */}
      {open && options.map(o => (
        <Pressable
          key={o.value}
          onPress={() => {
            onChange(o.value);
            setOpen(false);
          }}
          className="py-2"
        >
          <Text className="text-right text-gray-700">
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}