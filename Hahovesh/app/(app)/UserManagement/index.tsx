import { View, Text, SafeAreaView, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import UsersArea from "./UsersArea";
import { DocumentData, doc as firestoreDoc } from "firebase/firestore";
import { getAllUsers } from "../../../services/users";
import { Button } from "@/components/Button";
import ManagementHeader from "./ManagementHeader";
import { StatusBar } from "expo-status-bar";
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
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1 bg-gray-100 w-full pb-[120px] grow"
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        overScrollMode="always"
      >
        <SafeAreaView className="flex-1 p-4">
          <ManagementHeader />
          <Pressable
            onPress={updateDataChange}
            disabled={isLoading}
            className="bg-blue-500 rounded-lg px-4 py-2 items-center justify-center mb-4 flex-row-reverse"
          >
            {isLoading ? (
              <Text className="text-white font-bold">טוען...</Text>
            ) : (
              <View className="flex flex-row items-center">
                <Ionicons
                  name="refresh"
                  size={20}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-white font-bold">רענן נתונים</Text>
              </View>
            )}
          </Pressable>

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
