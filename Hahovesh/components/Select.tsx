import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import tw from 'twrnc';

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
    <View style={tw`border border-blue-300 rounded-lg bg-blue-50 px-3 py-2`}>
      {/* Selected value (header) */}
      <Pressable onPress={() => setOpen(prev => !prev)}>
        <Text style={tw`text-right text-gray-800`}>
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
          style={tw`py-2`}
        >
          <Text style={tw`text-right text-gray-700`}>
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}