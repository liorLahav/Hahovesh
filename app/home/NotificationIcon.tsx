import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationIcon({ unreadCount }: { unreadCount: number }) {
  return (
    <View className="relative">
      <Ionicons name="notifications-outline" size={28} color="gray" />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
          <Text className="text-white text-xs font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}
