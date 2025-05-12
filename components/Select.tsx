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
    <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 6 }}>
      {/* title/value */}
      <Pressable onPress={() => setOpen(prev => !prev)}>
        <Text style={{ textAlign: 'right', writingDirection: 'rtl' }}>
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
            style={{ paddingVertical: 4 }}
          >
            <Text style={{ textAlign: 'right', writingDirection: 'rtl' }}>
              {o.label}
              </Text>
          </Pressable>
        ))}
    </View>
  );
}
