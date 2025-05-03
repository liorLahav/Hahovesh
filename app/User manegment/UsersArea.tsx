import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { useState, useEffect } from 'react';
import User from './User';
import { DocumentData } from 'firebase/firestore';

type UsersAreaProps = {
    type: string;
    users: DocumentData[];
    refresh: () => void;
}


const UsersArea = (props : UsersAreaProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>{props.type}</Text>
            <ScrollView style={styles.scrollView}>
                {props.users.length > 0 ? (
                    props.users.map((user, index) => (
                        <User refresh={props.refresh} key={index} first_name={user.first_name} last_name={user.last_name} phone={user.phone} id={user.id} type={user.type} permissions={user.permissions}/>
                    ))
                ) : (
                    <Text style={styles.emptyMessage}>אין משתמשים להצגה</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#3a3a3a',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    scrollView: {
        maxHeight: 300,
    },
    emptyMessage: {
        textAlign: 'center',
        padding: 20,
        color: '#888',
        fontStyle: 'italic',
    }
});

export default UsersArea;