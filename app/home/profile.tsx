// its just for test and debugging toolbar
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import HomePageHeader from "./HomePageHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <SafeAreaView>
      <HomePageHeader />
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl font-bold text-blue-700">פרופיל</Text>
        <Text className="text-lg text-gray-800">פרטי המשתמש</Text>
      </View>
    </SafeAreaView>
  );
}
