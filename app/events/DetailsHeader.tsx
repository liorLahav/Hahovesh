import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import { useRouter } from "expo-router";
import logo from "../../assets/images/logo.png";

export default function DetailsHeader() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const router = useRouter();

  return (
    <>
      <View className="w-full h-1 bg-red-500 rounded-t-xl" />
      <View className="bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-2xl shadow-sm">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.push("/home/HomePage")}>
            <Ionicons name="arrow-back" size={28} color="#1e3a8a" />
          </Pressable>

          <Text className="text-xl font-bold text-blue-800">פרטים נוספים</Text>

          <Image
            source={logo}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </>
  );
}
