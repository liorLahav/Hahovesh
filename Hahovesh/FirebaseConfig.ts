import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, doc } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import Constants from "expo-constants";
import auth from '@react-native-firebase/auth';


const {
  firebaseApiKey,
  firebaseAuthDomain,
  firebaseProjectId,
  firebaseStorageBucket,
  firebaseMessagingSenderId,
  firebaseAppId,
  firebaseMeasurementId,
  firebaseDatabaseUrl, 
} = Constants.expoConfig?.extra ?? {};

export const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  databaseURL: firebaseDatabaseUrl,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId,
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const authInstance = getAuth(app);
// After user is signed in natively
auth().onAuthStateChanged(async (user) => {
  console.log("user",user);
  if (user) {
    const idToken = await user.getIdToken();
    console.log(idToken);
    await signInWithCustomToken(authInstance, idToken);
    console.log("Firebase JS SDK signed in!");

    // Only now do your Firestore reads
    const userDoc = await getDoc(doc(db, "users", user.uid));
    console.log("User data:", userDoc.data());
  }
});
