import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import logo from "../../../assets/images/logo.png";

export default function MessagesFormHeader() {
  const router = useRouter();

  return (
    <>
      <View className="w-full h-1 bg-red-500 rounded-t-xl" />
      <View className="bg-blue-700 border-b border-blue-900 py-4 px-4 rounded-b-2xl shadow-sm">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </Pressable>

          <View className="items-center">
            <Text
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "Assistant-Bold" }}
            >
              שליחת הודעה
            </Text>
            <View className="w-16 h-1 bg-white mt-2 rounded-full" />
          </View>

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
