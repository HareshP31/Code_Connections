// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu-8Xs4u4t8KC8pyreUFZkbRIVLk7kNrM",
  authDomain: "code-connections.firebaseapp.com",
  projectId: "code-connections",
  storageBucket: "code-connections.firebasestorage.app",
  messagingSenderId: "258359074913",
  appId: "1:258359074913:web:e9c1ebc584590c69f18a20",
  measurementId: "G-DM2L9T8GXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);