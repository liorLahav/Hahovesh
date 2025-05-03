import { SafeAreaView, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";

export default function HomePageHeader() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <SafeAreaView>
      <View className="w-full flex-wrap flex-row items-center justify-between px-2 h-[55px] bg-gray-100 shadow-sm">
        <Pressable
          onPress={() => navigation.openDrawer()}
          className="p-2"
        >
          <Ionicons name="menu" size={30} color="black" />
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
