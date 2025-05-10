import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

/** אפשרויות לתיבת הבחירה */
type Option = { label: string; value: string };

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}

/** קומפוננטת בחירה בסיסית */
export default function Select({ value, onChange, options }: Props) {
  const [open, setOpen] = useState(false);

  // תווית הערך הנבחר (או ברירת‑מחדל)
  const selectedLabel =
    options.find(o => o.value === value)?.label ?? 'בחר';

  return (
    <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 6 }}>
      {/* כותרת הפתיחה / הערך הנבחר */}
      <Pressable onPress={() => setOpen(prev => !prev)}>
        <Text style={{ textAlign: 'right', writingDirection: 'rtl' }}>
          {selectedLabel}
          </Text>
      </Pressable>

      {/* רשימת אפשרויות */}
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
