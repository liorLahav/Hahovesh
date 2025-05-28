

import { onValue, ref } from "firebase/database";
import { realtimeDb } from "../FirebaseConfig";

export const listenToRTDBConnection = (
  callback: (isOnline: boolean) => void
) => {
  const connectedRef = ref(realtimeDb, ".info/connected");

  const unsubscribe = onValue(connectedRef, (snapshot) => {
    const isOnline = snapshot.val() === true;
    callback(isOnline);
  });

  return unsubscribe; 
};
