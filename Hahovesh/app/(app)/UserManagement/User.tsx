import { View, Text } from "react-native";
import { useState } from "react";
import PermissionsPanel from "./PermissionsPanel";
import ApprovePanel from "./ApprovePanel";
import DeleteUserButton from "./DeleteUserButton";

type UserProps = {
  user: any;
  refresh: () => void;
  isActive: string;
};

const User = (props: UserProps) => {
  // Add state to track if permissions are being updated
  const [isUpdating, setIsUpdating] = useState(false);

  // Wrap the refresh function to handle loading state
  const handleRefresh = async () => {
    setIsUpdating(true);
    try {
      await props.refresh();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View className="bg-white rounded-lg overflow-hidden my-1 mx-1.5 h-[75px] py-2 px-3 border border-gray-200">
      <View className="flex-row items-stretch">
        {/* Left side - Permissions Panel */}
        <View className="flex-[1.2] bg-gray-50">
          {!props.user.permissions.includes("Pending") ? (
            <PermissionsPanel user={props.user} refresh={handleRefresh} />
          ) : (
            <ApprovePanel user={props.user} refresh={handleRefresh} />
          )}
        </View>

        {/* Vertical divider */}
        <View className="w-[1px] bg-gray-200" />

        {/* Right side - User Info */}
        <View className="flex-[0.8] py-1.5 px-2.5 justify-center relative">
          <Text className="text-xs mb-0.5 font-bold text-gray-800 text-right">
            שם:{" "}
            <Text className="font-normal text-gray-600">
              {props.user.first_name + " " + props.user.last_name}
            </Text>
          </Text>
          <Text className="text-xs mb-0.5 font-bold text-gray-800 text-right">
            טלפון:{" "}
            <Text className="font-normal text-gray-600">
              {props.user.phone}
            </Text>
          </Text>
          <Text className="text-xs mb-0.5 font-bold text-gray-800 text-right">
            ת"ז:{" "}
            <Text className="font-normal text-gray-600">{props.user.id}</Text>
          </Text>
          <View className="absolute top-10 left-1">
            {props.isActive === "משתמשים פעילים" && (
              <DeleteUserButton
                refresh={props.refresh}
                userId={props.user.id}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default User;
