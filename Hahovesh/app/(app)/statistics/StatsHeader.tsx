import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import tw from "twrnc";

export default function StatsHeader() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <>
      <View style={tw`w-full h-1 bg-red-500 rounded-t-xl`} />
      <View style={tw`relative h-24 justify-center bg-blue-50 items-center border-b border-blue-300`}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          style={tw`absolute right-4 top-5`}
        >
          <Ionicons name="menu" size={30} color="black" />
        </Pressable>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={[{ width: 45, height: 45 }, tw`absolute left-4 top-5`]}
          resizeMode="contain"
        />

        {/* התוכן המרכזי */}
        <View style={tw`items-center justify-center`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>סטטיסטיקות</Text>
          <Text style={tw`text-base text-gray-700`}>החובש הר נוף</Text>
        </View>
      </View>
    </>
  );
}
