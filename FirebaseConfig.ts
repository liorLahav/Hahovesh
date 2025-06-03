import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAwFn5-CkW1rK3hukWdEWJ0EMom08e4Kpw",
  authDomain: "hahovesh-project.firebaseapp.com",
  databaseURL: "https://hahovesh-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hahovesh-project",
  storageBucket: "hahovesh-project.appspot.com",
  messagingSenderId: "259653569192",
  appId: "1:259653569192:web:d8640079b0c50a828d109d",
  measurementId: "G-ZMB4E0BNNJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

