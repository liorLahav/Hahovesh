// HomePageHeader.js
import { SafeAreaView, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/Button";
import { User } from "lucide-react-native";

export default function HomePageHeader() {
  return (
    <SafeAreaView>
      <View className="w-full flex-wrap flex-row items-center justify-between px-2 h-[55px] bg-gray-100 shadow-sm">
        <Pressable className="w-12 h-12 ml-1 rounded-full bg-black items-center justify-center flex-row gap-1">
          {/* <User color="white" size={28} /> */}
          <Text className="text-sm text-white">Guest</Text>
        </Pressable>

        <View className="flex-row items-center space-x-2">
          <View>
            <Text className="text-2xl font-bold text-blue-700">
              החובש הר נוף
            </Text>
            <Text className="text-base text-blue-700">ארגון ההצלה השכונתי</Text>
          </View>
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 45, height: 45 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
