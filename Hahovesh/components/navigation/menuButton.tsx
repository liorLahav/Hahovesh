import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/native";
import tw from "twrnc";

type MenuButtonProps = {
  className?: string;
};

const MenuButton: React.FC<MenuButtonProps> = ({ className = "" }) => {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <Pressable
      onPress={() => navigation.openDrawer()}
      style={tw`p-2 ${className}`}
    >
      <Ionicons name="menu" size={30} color="black" />
    </Pressable>
  );
};

export default MenuButton;
