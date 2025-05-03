import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from "react-native";
import { useState, useEffect, use } from "react";
import UsersArea from "./UsersArea";
import {db} from "../../FirebaseConfig";
import { collection, getDocs, DocumentData, Firestore, doc as firestoreDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAllUsers } from "../../services/users";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const UserManegmentScreen = () => {
    const [activeUsers, setactiveUsers] = useState<DocumentData[] | null>(null);
    const [pendingUsers, setpendingUsers] = useState<DocumentData[] | null>(null);
    const [dataChanged, setDataChanged] = useState(false);

    useEffect(() => {
            const fetchUsers = async () => {
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
                }
            };
            fetchUsers();

    }, [dataChanged]);

    const updateDataChange = () => {
        setDataChanged(true);
    }

    return (
        <ScrollView style={styles.safeArea} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <Text style={styles.screenTitle}>ניהול משתמשים</Text>
                {pendingUsers && <UsersArea type="ממתינים לאישור" users={pendingUsers} refresh={updateDataChange}/>}
                {activeUsers && <UsersArea type="משתמשים פעילים" users={activeUsers} refresh={updateDataChange}/>}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f2f5',
        overflow: 'hidden',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#2c3e50',
    }
});

export default UserManegmentScreen;

