import { collection, query, where, getDocs } from "firebase/firestore";
import { db, app } from "../FirebaseConfig";
import { User } from "@/hooks/UserContext";
import { get } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";
import auth, { onAuthStateChanged } from '@react-native-firebase/auth';

export const checkAuthState = (): Promise<null | any> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth(), (user) => {
      unsubscribe(); 
      resolve(user as any | null);
    });
  });
};
