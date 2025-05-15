import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

type Option = { label: string; value: string };

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}

export default function Select({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);


  const selectedLabel =
    options.find(o => o.value === value)?.label ?? 'בחר';

  return (
    <View className="border border-blue-300 rounded-lg bg-blue-50 px-3 py-2">
      {/* title/value */}
      <Pressable onPress={() => setOpen(prev => !prev)}>
        <Text className="text-right text-gray-800">
          {selectedLabel}
          </Text>
      </Pressable>

      {/* list of options*/}
      {open &&
        options.map(o => (
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
