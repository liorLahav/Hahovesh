import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import tw from "twrnc";
import { updatePermissions, deleteUser } from "@/services/users";
import { User } from "@/hooks/UserContext";

type ApprovePanelProps = {
  user: User;
  refresh: () => void;
};

const ApprovePanel: React.FC<ApprovePanelProps> = ({ user, refresh }) => {
  const onApprove = () => {
    user.permissions = ["Volunteer"];
    updatePermissions(user.id, user.permissions)
      .then(refresh)
      .catch((error: Error) => {
        console.error("Error updating permissions: ", error);
        Alert.alert("שגיאה", "לא ניתן לאשר את המשתמש כעת, פנה למנהל המערכת.");
      });
  };

  const onDeny = () => {
    deleteUser(user.id)
      .then(refresh)
      .catch((error: Error) => {
        console.error("Error deleting user: ", error);
        Alert.alert("שגיאה", "לא ניתן למחוק את המשתמש כעת, פנה למנהל המערכת.");
      });
  };

  return (
    <View style={tw`w-32 p-3 justify-center bg-white ml-3`}>  
      <Text style={tw`text-xs font-bold mb-2 text-center text-black`}>אישור משתמש:</Text>
      <View style={tw`flex-row justify-between`}>  
        <TouchableOpacity
          onPress={onApprove}
          style={tw`py-2 px-3 rounded border border-green-500 bg-green-50 items-center mx-1`}
        >
          <Text style={tw`text-sm font-medium text-green-700`}>אשר</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDeny}
          style={tw`py-2 px-3 rounded border border-red-500 bg-red-50 items-center mx-1`}
        >
          <Text style={tw`text-sm font-medium text-red-700`}>דחה</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApprovePanel;
