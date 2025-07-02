import { View, Pressable, Text, ScrollView, LayoutAnimation } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import tw from 'twrnc';

type FilterType = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

interface Props {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  customDate: Date | null;
  setCustomDate: (d: Date | null) => void;
}

export default function FilterBar({ filter, setFilter, customDate, setCustomDate }: Props) {
  const openPicker = () =>
    DateTimePickerAndroid.open({
      mode: 'date',
      value: customDate ?? new Date(),
      maximumDate: new Date(),
      onChange: (_e, date) => {
        if (date) {
          setCustomDate(date);
          setFilter('custom');
        }
      },
    });

  const Chip = (label: string, val: FilterType, extra?: () => void) => (
    <Pressable
      key={val}
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        extra ? extra() : setFilter(val);
      }}
      style={tw`px-3 py-1.5 rounded-full border ml-2 ${
        filter === val
          ? 'bg-blue-600 border-blue-700'
          : 'bg-white border-blue-300'
      }`}
    >
      <Text style={tw`${filter === val ? 'text-white' : 'text-blue-700'}`}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={tw`bg-blue-100 px-3 py-2`}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row-reverse', alignItems: 'center' }}
      >
        {Chip('הכל', 'all')}
        {Chip('היום', 'today')}
        {Chip('שבוע', 'week')}
        {Chip('חודש', 'month')}
        {Chip('שנה', 'year')}
        {Chip(
          filter === 'custom' && customDate
            ? customDate.toLocaleDateString('he-IL')
            : 'בחר תאריך…',
          'custom',
          openPicker,
        )}
      </ScrollView>
    </View>
  );
}
