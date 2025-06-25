import { View, Pressable, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import MenuButton from "@/components/navigation/menuButton";

/** כותרת דבוקה לכל המסכים */
export default function Header() {
  const router = useRouter();

  return (
    <>
      <View className="w-full h-1 bg-red-500" />
      <View className="relative h-24 items-center justify-center bg-blue-50 border-b border-blue-300">
        {/* חץ חזרה */}
        <Pressable className="absolute right-4 top-4 p-2">
          <MenuButton />
        </Pressable>

        {/* לוגו */}
        <Image
          source={require('../../../assets/images/logo.png')}
          className="absolute left-4 top-4 w-10 h-10"
          resizeMode="contain"
        />

        <Text className="text-2xl font-bold text-gray-800">דוחות סיכום</Text>
        <Text className="text-base text-gray-700">החובש הר נוף</Text>
      </View>
    </>
  );
}
