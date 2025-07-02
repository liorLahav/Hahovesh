import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect, use } from "react";
import tw from "twrnc";
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
    <View style={tw`w-50 p-4 h-full justify-center bg-white`}>
      <Text style={tw`text-base font-bold mb-2.5 text-center text-gray-800`}>
        אישור משתמש:
      </Text>
      <View style={tw`flex-row-reverse justify-between items-center`}>
        <TouchableOpacity
          style={tw`py-2 px-3 rounded-lg border border-green-500 bg-green-50 items-center flex-1 mx-1`}
          onPress={onAprove}
        >
          <Text style={tw`text-sm font-medium tect-center`}>אשר</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`py-2 px-3 rounded-lg border border-red-500 bg-red-50 items-center flex-1 mx-1`}
          onPress={onDeny}
        >
          <Text style={tw`text-sm font-medium`}>דחה</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApprovePanel;
