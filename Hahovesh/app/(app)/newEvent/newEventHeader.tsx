import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import { useRouter } from "expo-router";
import logo from "../../../assets/images/logo.png";
import tw from 'twrnc';

export default function DetailsHeader() {
  const router = useRouter();

  return (
    <>
      <View style={tw`w-full h-1 bg-red-500 rounded-t-xl`} />
      <View style={tw`bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-2xl shadow-sm`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Pressable onPress={() => router.push("/home")}>
            <Ionicons name="arrow-back" size={28} color="#1e3a8a" />
          </Pressable>

          <Text style={tw`text-xl font-bold text-blue-800`}>אירוע חדש</Text>

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
