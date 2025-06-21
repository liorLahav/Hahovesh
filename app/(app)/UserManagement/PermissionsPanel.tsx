import { View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { updatePermissions } from "../../../services/users";
import { User, useUserContext } from "@/hooks/UserContext";



const ROLES = {
  Volunteer: ["Volunteer"],
  Dispatcher: ["Volunteer", "Dispatcher"],
  Admin: ["Volunteer", "Dispatcher", "Admin"],
};
type permissionsPanelProps = {
  user : User;
  refresh: () => void;
}

const PermissionsPanel = (props : permissionsPanelProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const userHasRoles = (role: keyof typeof ROLES) => {
    return props.user.permissions.includes(role);
  };
  

  const handleRoleSelection = async (role: keyof typeof ROLES) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const selectedPermissions = ROLES[role];
      props.user.permissions = selectedPermissions;
      await updatePermissions(props.user.id, selectedPermissions);
      props.refresh();
    } catch (error) {
      console.error("Error updating permissions: ", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderButton = (role: keyof typeof ROLES, label: string) => {
    const isSelected = userHasRoles(role);
    return (
      <TouchableOpacity
        className={`py-2.5 px-2 rounded-lg border items-center flex-1 mx-[2px]
          ${
            isSelected
              ? "bg-blue-50 border-blue-500"
              : "bg-gray-50 border-gray-300"
          }
          ${isUpdating ? "opacity-50" : "opacity-100"}`}
        onPress={() => handleRoleSelection(role)}
        key={props.user.id + role}
        disabled={isUpdating}
      >
        <Text
          className={`text-xs ${
            isSelected ? "text-blue-500 font-bold" : "text-gray-600 font-normal"
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="p-2 h-full justify-center bg-white">
      <Text className="text-base font-bold mb-2 text-center text-gray-800">
        הגדרת הרשאות:
      </Text>
      <View className="flex-row justify-around items-center space-x-1.5 px-0.5">
        {renderButton("Volunteer", "כונן")}
        {renderButton("Dispatcher", "מוקדן")}
        {renderButton("Admin", "מנהל")}
      </View>
    </View>
  );
};

export default PermissionsPanel;
