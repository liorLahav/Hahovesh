import { collection, query, where, getDocs } from "firebase/firestore";
import { db,auth, app } from "../FirebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { User } from "@/hooks/UserContext";
import { get } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";



export const checkAuthState = (): Promise<null | any> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); 
      resolve(user as any | null);
    });
  });
};
