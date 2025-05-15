import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import Select from './Select';
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
        <View key={field.key} className="mb-6">
          <Text className="mb-2 font-semibold text-right text-gray-800">
            {field.label}
          </Text>

          {field.type === 'text' && (
            <TextInput
              placeholder={field.placeholder}
              value={values[field.key]}
              keyboardType={field.keyboardType ?? 'default'}
              onChangeText={text => {
                const finalText = field.numericOnly
                  ? text.replace(/[^0-9]/g, '')
                  : text;
                setVal(field.key, finalText);
              }}
              className="border border-blue-300 rounded-lg p-3 w-full text-right bg-blue-50"
              style={{ writingDirection: 'rtl' }}
            />
          )}

          {/* ---------- textarea ---------- */} 
          {field.type === 'textarea' && (
            <TextInput
              placeholder={field.placeholder}
              value={values[field.key]}
              onChangeText={text => setVal(field.key, text)}
              multiline                     
              numberOfLines={field.rows ?? 4} 
              textAlignVertical="top"        
              className="border border-blue-300 rounded-lg p-3 w-full text-right bg-blue-50 min-h-[120px]" 
              style={{ writingDirection: 'rtl', minHeight: (field.rows ?? 4) * 24}}
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
      <View className="mt-8">
        <Pressable
          onPress={() => onSubmit(values)}
          className="w-full rounded-full h-14 bg-blue-600 shadow-md items-center justify-center">
          <Text className="text-white font-bold text-xl">שלח</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
