// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmTcqr6kSbFUtuZCrfze0y_sxXFv2qxBA",
  authDomain: "fisherapp-780cc.firebaseapp.com",
  projectId: "fisherapp-780cc",
  storageBucket: "fisherapp-780cc.appspot.com",
  messagingSenderId: "86591020369",
  appId: "1:86591020369:web:dbeb250e95b5449e004770",
  measurementId: "G-10ZSRLBLCK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { firestore, storage, auth };
