// app/index.tsx
import { Redirect } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import { usePushNotifications } from "@/hooks/NotificationsHook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager, Platform } from 'react-native';
import * as Updates from 'expo-updates';


export default function Index() {
  const {isAuthenticated,userLoading} = useUserContext();

  useEffect(() =>{
    if (I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);  
      if (Platform.OS !== 'web') {
        Updates.reloadAsync();      
      }
    }
  },[])

  if (userLoading) 
    return <Loading/>
  console.log("Redirecting to", isAuthenticated);
  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
}
