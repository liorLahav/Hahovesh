import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { useEffect, useState, useRef } from 'react';
import { router } from 'expo-router';

export interface PushNotificationState {
  expoPushToken?: string;
  devicePushToken?: string;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [devicePushToken, setDevicePushToken] = useState<string>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationsListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    (async () => {
      if (!Device.isDevice) {
        alert('Must use a physical device for Push Notifications');
        return;
      }

      // 1. Ask permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push permissions!');
        return;
      }

      // 2a. Expo Go → Expo push token
      if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(tokenData.data);
        console.log('Expo Push Token:', tokenData.data);
      }

      // 2b. Dev-client / standalone → native FCM/APNs token
      if (Constants.executionEnvironment === ExecutionEnvironment.Bare) {
        const tokenData = await Notifications.getDevicePushTokenAsync();
        setDevicePushToken(tokenData.data);
        console.log('Device Push Token:', tokenData.data);
      }


        await Notifications.setNotificationChannelAsync('events', {
            name: 'events',
            importance:   Notifications.AndroidImportance.MAX,
            vibrationPattern: [0,250,250,250,250,250,250,250,250],
            sound: 'events', // matches raw/events.wav
        });    
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Test Sound',
          body:  'Should play events.wav',
          sound: 'events',   // your custom sound
          // channelId: 'default'  <-- remove from here
        },
        trigger: {
          seconds: 5,
          repeats: false,
          channelId: 'messages',  // ← put it here instead
        },
    }).finally(() => {
      console.log('Test notification scheduled');   
    });
    })();

    notificationsListener.current = Notifications.addNotificationReceivedListener(n => {
      setNotification(n);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(_ => {
      router.replace('/home');
    });

    return () => {
      notificationsListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken, devicePushToken, notification };
};
