// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // ← додай цей рядок

const firebaseConfig = {
  apiKey: "AIzaSyAH1hkHXFCV9NnpE1WAfvb-jWTpg84rDnY",
  authDomain: "volunteerua-76f34.firebaseapp.com",
  projectId: "volunteerua-76f34",
  storageBucket: "volunteerua-76f34.firebasestorage.app",
  messagingSenderId: "237654928087",
  appId: "1:237654928087:web:7d9845310c927e44b6de92",
  measurementId: "G-56FKHV3462"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // ← додай цей рядок
export default app;