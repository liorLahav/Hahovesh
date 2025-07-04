import { View, Text, Pressable, Image } from "react-native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import tw from "twrnc";

export default function EventSummaryHeader() {
  return (
    <>
      <View style={tw`w-full h-1 bg-red-500 rounded-t-xl`} />

      <View style={tw`relative h-24 justify-center bg-blue-50 items-center border-b border-blue-300`}>
        <Image
          source={require("../../../assets/images/logo.png")}
          resizeMode="contain"
          style={[
            { width: 45, height: 45 },
            tw`absolute left-4 top-5`
          ]}
        />
        <View style={tw`items-center justify-center`}>
          <Text style={tw`text-2xl font-bold text-gray-800`}>דוח סיכום</Text>
          <Text style={tw`text-base text-gray-700`}>החובש הר נוף</Text>
        </View>
      </View>
    </>
  );
}
