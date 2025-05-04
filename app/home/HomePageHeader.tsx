import { SafeAreaView, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";

export default function HomePageHeader() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <SafeAreaView>
      <View className="w-full bg-gray-100 shadow-sm p-2">
        {/* שורה עליונה עם טקסט ותמונה בצד ימין */}
        <View className="flex-row-reverse items-center justify-between mb-2">
          <View className="flex-row-reverse items-center space-x-reverse space-x-2">
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 45, height: 45 }}
              resizeMode="contain"
            />
            <View>
              <Text className="text-2xl font-bold text-blue-700">
                החובש הר נוף
              </Text>
              <Text className="text-base text-blue-700">ארגון ההצלה השכונתי</Text>
            </View>
          </View>
        </View>

        {/* שורה תחתונה עם כפתור התפריט */}
        <View className="flex-row justify-end">
          <Pressable onPress={() => navigation.openDrawer()} className="p-2">
            <Ionicons name="menu" size={30} color="black" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
