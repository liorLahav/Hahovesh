// app/index.tsx
import { Redirect } from "expo-router";
import { useUserContext } from "@/hooks/UserContext";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import { usePushNotifications } from "@/hooks/NotificationsHook";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Index() {
  const {isAuthenticated,userLoading} = useUserContext();

  // useEffect(() => {
  //   const clearAsyncStorage = async () => {
  //     try {
  //       await AsyncStorage.clear();
  //       console.log('✅ AsyncStorage cleared successfully');
  //     } catch (e) {
  //       console.error('❌ Failed to clear AsyncStorage:', e);
  //     }
  //   };

  //   clearAsyncStorage();
  // }, []);

  if (userLoading) 
    return <Loading/>
  console.log("Redirecting to", isAuthenticated);
  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
}
