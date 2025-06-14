import { View, Text, Pressable, Image } from "react-native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";

export default function EventSummaryHeader() {

  return (
    <>
      <View className="w-full h-1 bg-blue-700 rounded-t-xl" />
      <View className="relative h-24 justify-center bg-blue-50 items-center border-b border-blue-300">
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ width: 45, height: 45 }}
          resizeMode="contain"
          className="absolute left-4 top-5"
        />
        <View className="items-center justify-center">
          <Text className="text-2xl font-bold text-gray-800">דוח סיכום</Text>
          <Text className="text-base text-gray-700">החובש הר נוף</Text>
        </View>
      </View>
    </>
  );
}
