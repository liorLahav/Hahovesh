import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import type { DrawerNavigationProp } from "@react-navigation/drawer";
import type { ParamListBase } from "@react-navigation/native";
import tw from "twrnc";
import UsersArea from "./UsersArea";
import { DocumentData } from "firebase/firestore";
import { getAllUsers } from "../../../services/users";
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
        const tempActiveUsers = usersData.filter(
          (user) => !user.permissions.includes("Pending")
        );
        const tempPendingUsers = usersData.filter(
          (user) => user.permissions.includes("Pending")
        );
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <StatusBar style="dark" />
        <SafeAreaView>
          <ManagementHeader />

          <Pressable
            onPress={updateDataChange}
            disabled={isLoading}
            style={tw`bg-blue-500 rounded-lg px-4 py-2 items-center justify-center mb-4 flex-row-reverse`}
          >
            {isLoading ? (
              <Text style={tw`text-white font-bold`}>טוען...</Text>
            ) : (
              <View style={tw`flex flex-row items-center`}>  
                <Ionicons
                  name="refresh"
                  size={20}
                  color="white"
                  style={tw`mr-2`}
                />
                <Text style={tw`text-white font-bold`}>רענן נתונים</Text>
              </View>
            )}
          </Pressable>
        </SafeAreaView>

        <ScrollView
          showsVerticalScrollIndicator={true}
          alwaysBounceVertical={true}
          scrollEventThrottle={16}
          overScrollMode="always"
          style={tw`flex-1 bg-gray-100 w-full pb-[120px] grow`}
        >
          <SafeAreaView style={tw`flex-1 p-4`}>  
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

            <View style={tw`h-20`} />
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default UserManagementScreen;
