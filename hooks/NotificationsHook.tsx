import * as Notification from 'expo-notifications';
import { useRef, useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Device from 'expo-device';


export interface PushNotificationState{
    notification? : Notification.Notification;
    expoPushToken?: Notification.ExpoPushToken;
}

export const usePushNotifications = () : PushNotificationState => {
    Notification.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: false,
            shouldShowList: false,
        }),
    });
    const [expoPushToken, setExpoPushToken] = useState<Notification.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notification.Notification | undefined>();
    const notificationsListener = useRef<Notification.EventSubscription | null>(null);
    const responseListener = useRef<Notification.EventSubscription | null>(null);

    const registerForPushNotifications = async () => {
        let token;
        if(Device.isDevice) {
            const { status: existingStatus } = await Notification.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notification.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = await Notification.getExpoPushTokenAsync({
                projectId: Constants?.expoConfig?.extra?.eas?.projectId
            });
            if(Platform.OS == 'android') {
                Notification.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notification.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                });
            }
            return token;
        }
        else {
            alert('Must use physical device for Push Notifications');
        }
    }
    useEffect(() => {
        registerForPushNotifications().then(token => {
            if (token) {
                setExpoPushToken(token);
            }
        });
    
        notificationsListener.current = Notification.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
    
        responseListener.current = Notification.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
    
        return () => {
            if (notificationsListener.current) {
                notificationsListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);
    return {
        notification,
        expoPushToken
    };
}

