import { Drawer } from "expo-router/drawer";
import DrawerContent from "./home/DrawerContent";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import "../global.css";
import { View, Text } from "react-native";

export default function RootLayout() {
  const [roles, setRoles] = useState<string[] | null>(null);
  const userId = "IisLRRiXUKWwdeOaYOCS";

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const docRef = doc(db, "volunteers", userId); // docref is a function that creates a reference to the document in Firestore
        const docSnap = await getDoc(docRef); // getDoc is a function that retrieves the document from Firestore using the docRef
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRoles(
            Array.isArray(userData.permissions) ? userData.permissions : []
          ); // Check if permissions is an array and set it to state
          console.log("הרשאות:", roles);
        } else {
          console.log("לא נמצא משתמש");
          setRoles([]);
        }
      } catch (error) {
        console.error("שגיאה בשליפת role:", error);
        setRoles([]);
      }
    };
    fetchRole();
  }, []);

  if (!roles || roles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>טוען הרשאות...</Text>
      </View>
    );
  }

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} userRole={roles} />}
      screenOptions={{ headerShown: false, drawerPosition: "right" }}
    >
      <Drawer.Screen name="index" options={{ title: "בית" }} />
      <Drawer.Screen name="home/profile" options={{ title: "פרופיל" }} />
    </Drawer>
  );
}
