import { Drawer } from "expo-router/drawer";
import DrawerContent from "./home/DrawerContent";
import "../global.css";

export default function RootLayout() {
  return (
    <Drawer
    drawerContent={(props) => <DrawerContent {...props} />}
    screenOptions={{ headerShown: false }} // drawerPosition: 'right'
  ></Drawer>
  );
}
