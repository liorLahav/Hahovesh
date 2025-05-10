// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "hahovesh-project.firebaseapp.com",
  databaseURL: "https://hahovesh-project-default-rtdb.europe-west1.firebasedatabase.app", // Updated URL from error message
  projectId: "hahovesh-project",
  storageBucket: "hahovesh-project.firebasestorage.app",
  messagingSenderId: "259653569192",
  appId: "1:259653569192:web:d8640079b0c50a828d109d",
  measurementId: "G-ZMB4E0BNNJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app); // Initialize Realtime Database
