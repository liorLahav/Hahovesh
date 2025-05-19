import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function DetailsHeader() {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const router = useRouter();

  return (
    <>
      <View className="w-full h-1 bg-red-500 rounded-t-xl" />
      <View className="bg-blue-50 border-b border-blue-300 py-4 px-4 rounded-b-3xl shadow-sm">
        <View className="flex-row items-center justify-between">
          {/* חץ אחורה */}
          <Pressable onPress={() => router.push("/home/HomePage")}>
            <Ionicons name="arrow-back" size={28} color="#1e3a8a" />
          </Pressable>

          {/* כותרת */}
          <Text className="text-xl font-bold text-blue-800">פרטים נוספים</Text>

          {/* תפריט צד */}
          <Pressable onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color="#1e3a8a" />
          </Pressable>
        </View>
      </View>
    </>
  );
}

// V2
// import { View, Text, Pressable, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import type { DrawerNavigationProp } from "@react-navigation/drawer";
// import type { ParamListBase } from "@react-navigation/native";

// export default function DetailsHeader() {
//   const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

//   return (
//     <>
//       {/* קו עליון אדום */}
//       <View className="w-full h-1 bg-red-600 rounded-t-xl" />

//       {/* כותרת */}
//       <View className="relative h-28 justify-center bg-white border-b border-blue-200 shadow-sm rounded-b-3xl px-4">
//         {/* תפריט צד */}
//         <Pressable
//           onPress={() => navigation.openDrawer()}
//           className="absolute right-4 top-6"
//         >
//           <Ionicons name="menu" size={28} color="#1e3a8a" /> {/* כחול כהה */}
//         </Pressable>

//         {/* לוגו */}
//         <Image
//           source={require("../../assets/images/logo.png")}
//           style={{ width: 48, height: 48 }}
//           resizeMode="contain"
//           className="absolute left-4 top-6"
//         />

//         {/* כותרת מרכזית */}
//         <View className="items-center justify-center">
//           <Text className="text-2xl font-bold text-blue-900 tracking-wide">
//             פרטים נוספים
//           </Text>
//         </View>
//       </View>
//     </>
//   );
// }
