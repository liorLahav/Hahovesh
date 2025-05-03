import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';
import { updatePermissions, deleteUser } from '@/services/users';

type ApprovePanelProps = {
    refresh: () => void;
    user_id : string;
}
    
const ApprovePanel = (props : ApprovePanelProps) => { 
    const onAprove = () => {
        updatePermissions(props.user_id, ["volunteer"]).then(
            () => {
                props.refresh();
            }
        ).catch((error: Error) => {
            console.error("Error updating permissions: ", error);
        }
        );
    }
    const onDeny = () => {
        deleteUser(props.user_id).then(
            () => {
                props.refresh();
            }
        ).catch((error: Error) => {
            console.error("Error deleting user: ", error);
        }
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>אישור משתמש:</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                    style={[
                        styles.button,
                        styles.approveButton
                    ]}
                    onPress={() => onAprove()}
                >
                    <Text style={styles.buttonText}>אשר</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.button,
                        styles.denyButton
                    ]}
                    onPress={() => onDeny()}
                >
                    <Text style={styles.buttonText}>דחה</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    approveButton: {
        backgroundColor: '#f6ffed',
        borderColor: '#52c41a',
    },
    denyButton: {
        backgroundColor: '#fff1f0',
        borderColor: '#ff4d4f',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
    }
});

export default ApprovePanel;

