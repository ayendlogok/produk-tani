import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7EOb9uVWsZUDCgaZhMz9hql3vszyD7_8",
  authDomain: "tanicare-18369.firebaseapp.com",
  projectId: "tanicare-18369",
  storageBucket: "tanicare-18369.firebasestorage.app",
  messagingSenderId: "48489641185",
  appId: "1:48489641185:web:5a1a68e0f4f31e6b9ab3a0",
  measurementId: "G-BPY76ENWEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
