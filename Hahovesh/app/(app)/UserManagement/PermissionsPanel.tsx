import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import tw from "twrnc";
import { updatePermissions } from "../../../services/users";
import { User } from "@/hooks/UserContext";

const ROLES = {
  Volunteer: ["Volunteer"],
  Dispatcher: ["Volunteer", "Dispatcher"],
  Admin: ["Volunteer", "Dispatcher", "Admin"],
};

type PermissionsPanelProps = {
  user: User;
  refresh: () => void;
};

const PermissionsPanel: React.FC<PermissionsPanelProps> = ({ user, refresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const hasRole = (role: keyof typeof ROLES) =>
    user.permissions.includes(role);

  const selectRole = async (role: keyof typeof ROLES) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const perms = ROLES[role];
      user.permissions = perms;
      await updatePermissions(user.id, perms);
      refresh();
    } catch (err) {
      console.error(err);
      Alert.alert(
        "שגיאה",
        "לא ניתן לעדכן את ההרשאות כעת, פנה למנהל המערכת."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const renderBtn = (role: keyof typeof ROLES, label: string) => {
    const sel = hasRole(role);
    return (
      <TouchableOpacity
        key={role}
        onPress={() => selectRole(role)}
        disabled={isUpdating}
        style={[
          tw`px-2 py-1 rounded border items-center mx-0.5`,
          sel ? tw`bg-blue-50 border-blue-500` : tw`bg-gray-50 border-gray-300`,
          isUpdating && tw`opacity-50`,
        ]}
      >
        <Text style={sel ? tw`text-blue-500 text-xs font-bold` : tw`text-gray-600 text-xs`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
      <View style={tw`w-29 bg-white-50 p-1 ml-4`}>
        <Text style={tw`text-xs font-bold mb-1 text-center text-gray-800`}>
        הגדרת הרשאות:
      </Text>
      <View style={tw`flex-row justify-center`}>
        {renderBtn("Volunteer", "כונן")}
        {renderBtn("Dispatcher", "מוקדן")}
        {renderBtn("Admin", "מנהל")}
      </View>
    </View>
  );
};

export default PermissionsPanel;
