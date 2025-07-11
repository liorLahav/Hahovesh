import database from '@react-native-firebase/database';

export const listenToRTDBConnection = (
  callback: (isOnline: boolean) => void
) => {
  const connectedRef = database().ref('.info/connected');

  const listener = connectedRef.on('value', snapshot => {
    const isOnline = snapshot.val() === true;
    callback(isOnline);
  });

  // Return unsubscribe function
  return () => connectedRef.off('value', listener);
};
