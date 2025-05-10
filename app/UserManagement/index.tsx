import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import UsersArea from "./UsersArea";
import {db} from "../../FirebaseConfig";
import { collection, getDocs, DocumentData, Firestore, doc as firestoreDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
            try{
                let usersData : DocumentData[] = await getAllUsers();
                console.log(usersData);
                const tempActiveUsers = usersData.filter(user => user.permissions.includes("Pending") === false);
                const tempPendingUsers = usersData.filter(user => user.permissions.includes("Pending") === true);
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
    }

    return (
        <ScrollView 
            className="flex-1 bg-gray-100 w-full pb-[120px] grow"
            showsVerticalScrollIndicator={true}
            alwaysBounceVertical={true}
            scrollEventThrottle={16}
            overScrollMode="always"
        >
            <SafeAreaView className="flex-1 p-4">
                <Text className="text-2xl font-bold text-center my-5 text-gray-800">
                    ניהול משתמשים
                </Text>
                
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
    );
}

export default UserManagementScreen;

