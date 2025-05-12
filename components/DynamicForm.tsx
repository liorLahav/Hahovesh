import { View, Text, TextInput, ScrollView } from 'react-native';
import Select from './Select';
import { Button } from './Button';
import { useState } from 'react';
import type { SchemaField } from '../data/formSchema';

export type Field = SchemaField;

interface Props {
  schema: SchemaField[];
  onSubmit: (values: Record<string, string>) => void;
}

/** Dynamic form generated from a schema */
export default function DynamicForm({ schema, onSubmit }: Props) {
  /** Initial state – empty map key → value */
  const initialState = schema.reduce<Record<string, string>>(
    (acc, field) => ({ ...acc, [field.key]: '' }),
    {},
  );
  const [values, setValues] = useState(initialState);

  /** Update a single value */
  const setVal = (key: string, val: string) =>
    setValues(prev => ({ ...prev, [key]: val }));

  return (
    <ScrollView /* ... */>
      {schema.map(field => (
        <View key={field.key} style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 4 }}>{field.label}</Text>

          {field.type === 'text' && (
            <TextInput
              placeholder={field.placeholder}
              value={values[field.key]}
              // מקלדת מתאימה (ברירת מחדל default)
              keyboardType={field.keyboardType ?? 'default'}
              onChangeText={text => {
                // אם numericOnly, נוסיף סינון אוטומטי של כל תו שאינו ספרה
                const finalText = field.numericOnly
                  ? text.replace(/[^0-9]/g, '')
                  : text;
                setVal(field.key, finalText);
              }}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                width: '100%',
                textAlign: 'right',
                writingDirection: 'rtl',
              }}
            />
          )}

          {field.type === 'picker' && Array.isArray(field.options) && (
            <Select
              value={values[field.key]}
              onChange={v => setVal(field.key, v)}
              options={[{ label: 'בחר', value: '' }, ...field.options]}
            />
          )}
        </View>
      ))}

      <Button label="שלח" onPress={() => onSubmit(values)} className="mt-4" />
    </ScrollView>
  );
}
