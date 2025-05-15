import {View, Text, TouchableOpacity} from 'react-native';
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
        <View className="p-4 h-full justify-center bg-white">
            <Text className="text-base font-bold mb-2.5 text-center text-gray-800">אישור משתמש:</Text>
            <View className="flex-row-reverse justify-between items-center">
                <TouchableOpacity 
                    className="py-2 px-3 rounded-lg border border-green-500 bg-green-50 items-center flex-1 mx-1"
                    onPress={() => onAprove()}
                >
                    <Text className="text-sm font-medium tect-center">אשר</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    className="py-2 px-3 rounded-lg border border-red-500 bg-red-50 items-center flex-1 mx-1"
                    onPress={() => onDeny()}
                >
                    <Text className="text-sm font-medium">דחה</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default ApprovePanel;

