import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import {updatePermissions} from "../../services/users";
import { DocumentData } from "firebase/firestore";

type PermissionsPanelProps = {
    refresh: () => void;
    user_id : string;
    premissions: string[];
}

const PermissionsPanel = (props : PermissionsPanelProps) => {
    const [currentPermistion, setcurrentPermistion] = useState<string[]>(props.premissions);

    const handleRoleSelection = (role: string) => {
        console.log("User ID: ", props.user_id);
        let permistionsArray = ["Volunteer", "Dispatcher", "Admin"];
        if (role === "Volunteer"){
            permistionsArray = ["Volunteer"];
        } else if (role === "Dispatcher"){
            permistionsArray = ["Volunteer", "Dispatcher"];
        }
        console.log("Selected role: ", permistionsArray);
        setcurrentPermistion(permistionsArray);
        updatePermissions(props.user_id,permistionsArray).then(
            () => {
                props.refresh();
            }
        ).catch((error: Error) => {
            console.error("Error updating permissions: ", error);
        }
        );
    };
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>הגדרת הרשאות:</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={[
                        styles.button, 
                        currentPermistion.includes('Volunteer') && styles.buttonPressed
                    ]}
                    onPress={() => handleRoleSelection('Volunteer')}
                >
                    <Text style={[
                        styles.buttonText,
                        currentPermistion.includes('Volunteer') && styles.buttonTextPressed
                    ]}>כונן</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.button, 
                        currentPermistion.includes('Dispatcher') && styles.buttonPressed
                    ]}
                    onPress={() => handleRoleSelection('Dispatcher')}
                >
                    <Text style={[
                        styles.buttonText,
                        currentPermistion.includes('Dispatcher') && styles.buttonTextPressed
                    ]}>מוקדן</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.button, 
                        currentPermistion.includes('Admin') && styles.buttonPressed
                    ]}
                    onPress={() => handleRoleSelection('Admin')}
                >
                    <Text style={[
                        styles.buttonText,
                        currentPermistion.includes('Admin') && styles.buttonTextPressed
                    ]}>מנהל</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PermissionsPanel;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        height: '100%',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    buttonPressed: {
        backgroundColor: '#e6f7ff',
        borderColor: '#1890ff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
    },
    buttonText: {
        color: '#555',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonTextPressed: {
        color: '#1890ff',
        fontWeight: 'bold',
    },
});