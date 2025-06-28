import { View, Text, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import Select from './Select';
import { useState } from 'react';
import type { SchemaField } from '@/data/fromSchema_eventSummary';
import { saveEventSummary } from '@/services/event_summary';

type Option = { label: string; value: string };

interface Props {
  schema: SchemaField[];
  onSubmit: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
  submitLabel?: string;
}

export default function DynamicForm({ schema, onSubmit, initialValues , submitLabel = "שלח" }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    schema.reduce((acc, f) => ({
      ...acc,
      [f.key]: initialValues?.[f.key] ?? f.defaultValue ?? ''
    }), {})
  );

  const [requireRefusalForm, setRequireRefusalForm] = useState(false);

  const setVal = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const toggleMultiSelect = (key: string, value: string) => {
    const current = values[key]?.split(',') || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setVal(key, updated.join(','));
  };

  const handleSubmit = () => {
    for (const field of schema) {
      if (field.required) {
        const val = values[field.key];
        if (!val || (typeof val === 'string' && !val.trim())) {
          Alert.alert('שגיאה', `אנא מלאו את השדה: ${field.label}`);
          return;
        }
      }
    }
    if (requireRefusalForm && !values['refusal_form']) {
      Alert.alert('שגיאה', 'נדרש למלא טופס סירוב כאשר תיבת הסימון מסומנת');
      return;
    }

  onSubmit({
    ...values,
    requireRefusalForm: requireRefusalForm.toString(),
  });
};
  return (
    <ScrollView className="flex-1 bg-white p-4" contentContainerStyle={{ paddingBottom: 80 }}>
      {schema.map((field) => {
        const isLast = field.key === 'additional_notes';
        const isRefusalForm = field.key === 'refusal_form';

        return (
          <View
            key={field.key}
            className={['mb-4', isLast && 'pt-4 border-t border-gray-300 mt-8'].filter(Boolean).join(' ')}
          >
            {field.type === 'title' ? (
              <Text className="text-lg font-bold mb-2 text-right border-b border-gray-300 pb-1">
                {field.label}
              </Text>
            ) : (
              <>
                {isRefusalForm && (
                  <Pressable
                    onPress={() => setRequireRefusalForm(prev => !prev)}
                    className="flex-row items-center justify-end mb-2"
                  >
                    <View
                      className={`w-4 h-4 mr-2 rounded border-2 ${requireRefusalForm ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}
                    />
                    <Text className="text-sm">מילוי טופס סירוב</Text>
                  </Pressable>
                )}

                <Text className="mb-1 text-right font-medium">
                  {field.label}
                </Text>

                {field.type === 'text' && (
                  <TextInput
                    placeholder={field.placeholder}
                    value={values[field.key]}
                    onChangeText={t => {
                      if (field.lettersOnly) {
                          if (/^[א-תa-zA-Z ]*$/.test(t)) {
                              setVal(field.key, t);
                          }
                      } else if (field.numericOnly) { 
                          if (/^\d*$/.test(t)) {
                              setVal(field.key, t);
                          }
                      } else {
                              setVal(field.key, t);
                          }
                    }}  
                  keyboardType={
                    field.numericOnly ? 'numeric' :
                    field.keyboardType || 'default'
                  }
                    maxLength={field.maxLength}
                    className="border border-gray-300 rounded-lg p-3 w-full text-right"
                    style={{ writingDirection: 'rtl' }}
                    editable={!isRefusalForm || requireRefusalForm}
                  />
                )}

                {field.type === 'textarea' && (
                  <TextInput
                    placeholder={field.placeholder}
                    value={values[field.key]}
                    onChangeText={t => setVal(field.key, t)}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-lg p-3 w-full text-right min-h-[120px]"
                    style={{ writingDirection: 'rtl' }}
                    editable={!isRefusalForm || requireRefusalForm}
                  />
                )}

                {field.type === 'picker' && field.options && (
                  <Select
                    value={values[field.key]}
                    onChange={v => setVal(field.key, v)}
                    options={field.options}
                  />
                )}

                {field.type === 'multiselect' && field.options && (
                  <View className="gap-2 items-end">
                    {field.options.map((opt: Option) => {
                      const selected = values[field.key]?.split(',').includes(opt.value);
                      return (
                        <Pressable
                          key={opt.value}
                          onPress={() => toggleMultiSelect(field.key, opt.value)}
                          className="flex-row-reverse items-center gap-2"
                        >
                          <View
                            className={`w-4 h-4 rounded-full border-2 ${selected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}
                          />
                          <Text className="text-base">{opt.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </>
            )}
          </View>
        );
      })}

      <View className="mt-8">
        <Pressable
          onPress={handleSubmit}
          className="w-full rounded-full h-14 bg-blue-600 shadow-md items-center justify-center"
        >
          <Text className="text-white font-bold text-xl">{submitLabel}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
