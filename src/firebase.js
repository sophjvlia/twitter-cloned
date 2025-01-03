// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const VITE_API_KEY = import.meta.env['VITE_API_KEY'];
const VITE_AUTH_DOMAIN = import.meta.env['VITE_AUTH_DOMAIN'];
const VITE_PROJECT_ID = import.meta.env['VITE_PROJECT_ID'];
const VITE_STORAGE_BUCKET = import.meta.env['VITE_STORAGE_BUCKET'];
const VITE_MESSAGING_SENDER_ID = import.meta.env['VITE_MESSAGING_SENDER_ID'];
const VITE_APP_ID = import.meta.env['VITE_APP_ID']

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: VITE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
