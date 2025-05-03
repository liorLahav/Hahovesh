import {View, Text, StyleSheet} from 'react-native';
import { useState, useEffect } from 'react';
import PermissionsPanel from './PermissionsPanel';
import ApprovePanel from './ApprovePanel';

type UserProps = {
    type: string;
    first_name: string;
    last_name: string;
    phone: string;
    id: string;
    email?: string;
    permissions: string[];
    refresh: () => void;
}

const User = (props : UserProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.userCard}>
                <View style={styles.cardContent}>
                    {/* Left side - Permissions Panel */}
                    <View style={styles.leftSection}>
                        { !(props.permissions.includes("Pending")) ? 
                          (props.refresh ? <PermissionsPanel premissions={props.permissions} refresh={props.refresh} user_id={props.id} /> : null) : 
                          <ApprovePanel user_id={props.id} refresh={props.refresh} />}
                    </View>
                    
                    {/* Vertical divider */}
                    <View style={styles.verticalDivider} />
                    
                    {/* Right side - User Info */}
                    <View style={styles.userInfoSection}>
                        <Text style={styles.userInfo}>שם: <Text style={styles.userData}>{props.first_name + " " + props.last_name}</Text></Text>
                        <Text style={styles.userInfo}>טלפון: <Text style={styles.userData}>{props.phone}</Text></Text>
                        <Text style={styles.userInfo}>ת"ז: <Text style={styles.userData}>{props.id}</Text></Text>
                        {props.email && <Text style={styles.userInfo}>אימייל: <Text style={styles.userData}>{props.email}</Text></Text>}
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 10,
        marginVertical: 6,
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row', // Horizontal layout
        alignItems: 'stretch',
    },
    leftSection: {
        flex: 1.2, // Takes 1.2 parts of available space
        backgroundColor: '#f8f9fa',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#e0e0e0',
    },
    userInfoSection: {
        flex: 0.8, // Takes 0.8 parts of available space
        padding: 15,
        justifyContent: 'center',
    },
    userInfo: {
        fontSize: 16,
        marginBottom: 6,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    userData: {
        fontWeight: 'normal',
        color: '#666',
    }
});

export default User;
