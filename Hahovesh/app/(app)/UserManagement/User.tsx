import React, { useState } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import PermissionsPanel from "./PermissionsPanel";
import ApprovePanel from "./ApprovePanel";
import DeleteUserButton from "./DeleteUserButton";

type UserProps = {
  user: any;
  refresh: () => void;
  isActive: string;
};

const User: React.FC<UserProps> = ({ user, refresh, isActive }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRefresh = async () => {
    setIsUpdating(true);
    try {
      await refresh();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={tw`bg-white rounded-lg my-2 mx-0 border border-gray-200`}>
      <View style={tw`flex-row`}>
        {/* Left side – even wider */}
        <View style={tw`w-32 bg-white-50 p-1`}>
          {!user.permissions.includes("Pending") ? (
            <PermissionsPanel user={user} refresh={handleRefresh} />
          ) : (
            <ApprovePanel user={user} refresh={handleRefresh} />
          )}
        </View>

        {/* Divider – more horizontal gap */}
        <View style={tw`w-px bg-gray-200 mx-6`} />

        {/* Right side – flex-1 */}
        <View style={tw`flex-1 py-2 pr-3`}>
          <Text style={tw`text-xs font-bold text-gray-800 text-right mb-1`}>
            שם:{" "}
            <Text style={tw`font-normal text-gray-600`}>
              {user.first_name} {user.last_name}
            </Text>
          </Text>
          <Text style={tw`text-xs font-bold text-gray-800 text-right mb-1`}>
            טלפון:{" "}
            <Text style={tw`font-normal text-gray-600`}>{user.phone}</Text>
          </Text>
          <Text style={tw`text-xs font-bold text-gray-800 text-right`}>
            ת"ז:{" "}
            <Text style={tw`font-normal text-gray-600`}>{user.id}</Text>
          </Text>

          {isActive === "משתמשים פעילים" && (
            <View style={tw`absolute top-2 left-2`}>
              <DeleteUserButton userId={user.id} refresh={refresh} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default User;
