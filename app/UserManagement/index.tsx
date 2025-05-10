import { View, Text, SafeAreaView, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import UsersArea from "./UsersArea";
import { DocumentData, doc as firestoreDoc } from "firebase/firestore";
import { getAllUsers } from "../../services/users";
import { Button } from "@/components/Button";

const UserManagementScreen = () => {
  const [activeUsers, setactiveUsers] = useState<DocumentData[] | null>(null);
  const [pendingUsers, setpendingUsers] = useState<DocumentData[] | null>(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        let usersData: DocumentData[] = await getAllUsers();
        console.log(usersData);
        const tempActiveUsers = usersData.filter(
          (user) => user.permissions.includes("Pending") === false
        );
        const tempPendingUsers = usersData.filter(
          (user) => user.permissions.includes("Pending") === true
        );
        console.log("Active users: ", tempActiveUsers);
        console.log("Pending users: ", tempPendingUsers);
        setactiveUsers(tempActiveUsers);
        setpendingUsers(tempPendingUsers);
        setDataChanged(false);
      } catch (error) {
        console.error("Error fetching users: ", error);
        setactiveUsers(null);
        setpendingUsers(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [dataChanged]);

  const updateDataChange = () => {
    setDataChanged(true);
  };
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <>
      <ScrollView
        className="flex-1 bg-gray-100 w-full pb-[120px] grow"
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        overScrollMode="always"
      >
        <SafeAreaView className="flex-1 p-4">
          <View className="relative flex-row items-center justify-end">
            <Text className="absolute inset-x-0 text-2xl font-bold text-center my-5 text-gray-800">
              ניהול משתמשים
            </Text>
            <Pressable
              onPress={() => navigation.openDrawer()}
              className="p-2 items-end"
            >
              <Ionicons name="menu" size={30} color="black" />
            </Pressable>
          </View>

          <Button
            onPress={updateDataChange}
            className="bg-blue-500 text-white p-2 rounded mb-4"
            label={isLoading ? "טוען..." : "רענן נתונים"}
            disabled={isLoading}
          />

          {pendingUsers && (
            <UsersArea
              type="ממתינים לאישור"
              users={pendingUsers}
              refresh={updateDataChange}
            />
          )}

          {activeUsers && (
            <UsersArea
              type="משתמשים פעילים"
              users={activeUsers}
              refresh={updateDataChange}
            />
          )}

          {/* Add extra padding at the bottom for better scrolling */}
          <View className="h-20" />
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default UserManagementScreen;
