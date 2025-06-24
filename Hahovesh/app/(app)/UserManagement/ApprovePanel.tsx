import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect, use } from "react";
import { updatePermissions, deleteUser } from "@/services/users";
import { User, useUserContext } from "@/hooks/UserContext";

type ApprovePanelProps = {
  user: User;
  refresh: () => void;
};

const ApprovePanel = (props: ApprovePanelProps) => {
  const onAprove = () => {
    props.user.permissions = ["Volunteer"];
    updatePermissions(props.user.id, props.user.permissions)
      .then(() => {
        props.refresh();
      })
      .catch((error: Error) => {
        console.error("Error updating permissions: ", error);
        Alert.alert("שגיאה", "לא ניתן לאשר את המשתמש כעת, פנה למנהל המערכת.");
      });
  };
  const onDeny = () => {
    deleteUser(props.user.id)
      .then(() => {
        props.refresh();
      })
      .catch((error: Error) => {
        console.error("Error deleting user: ", error);
        Alert.alert("שגיאה", "לא ניתן למחוק את המשתמש כעת, פנה למנהל המערכת.");
      });
  };
  return (
    <View className="p-4 h-full justify-center bg-white">
      <Text className="text-base font-bold mb-2.5 text-center text-gray-800">
        אישור משתמש:
      </Text>
      <View className="flex-row-reverse justify-between items-center">
        <TouchableOpacity
          className="py-2 px-3 rounded-lg border border-green-500 bg-green-50 items-center flex-1 mx-1"
          onPress={() => onAprove()}
        >
          <Text className="text-sm font-medium tect-center">אשר</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-2 px-3 rounded-lg border border-red-500 bg-red-50 items-center flex-1 mx-1"
          onPress={() => onDeny()}
        >
          <Text className="text-sm font-medium">דחה</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApprovePanel;
