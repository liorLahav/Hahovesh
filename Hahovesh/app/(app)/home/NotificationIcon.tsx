import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function NotificationButton({ unreadCount }: { unreadCount: number }) {
  return (
    <View style={tw`relative`}>
      <Ionicons name="notifications-outline" size={28} color="gray" />
      {unreadCount > 0 && (
        <View style={tw`absolute -top-1.5 -right-1.5 bg-red-500 rounded-full w-5 h-5 items-center justify-center`}>
          <Text style={tw`text-white text-xs font-bold`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}