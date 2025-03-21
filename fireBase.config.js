// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFireStore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-7AfdbLeal0vxVSyAWlFCOFS5BQ4BhZs",
  authDomain: "harvesthub-hit200.firebaseapp.com",
  projectId: "harvesthub-hit200",
  storageBucket: "harvesthub-hit200.firebasestorage.app",
  messagingSenderId: "661843905794",
  appId: "1:661843905794:web:f0bcc19440b724980e861b",
  measurementId: "G-0PT1H7JKGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const database = getFireStore();