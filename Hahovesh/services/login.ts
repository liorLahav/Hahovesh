import auth, { onAuthStateChanged } from '@react-native-firebase/auth';

export const checkAuthState = (): Promise<null | any> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth(), (user) => {
      unsubscribe(); 
      resolve(user as any | null);
    });
  });
};
