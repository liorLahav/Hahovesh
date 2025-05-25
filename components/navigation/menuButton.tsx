import { Ionicons } from "@expo/vector-icons"
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "react-native"

type MenuButtonProps = {
    className?: string;
}

const MenuButton = (props : MenuButtonProps) => {
    const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
    return <>
        <Pressable onPress={() => navigation.openDrawer()} className={"p2 " + props.className}>
            <Ionicons name="menu" size={30} color="black" />
        </Pressable>
    </>
}

export default MenuButton;