import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyAOxXNq2ieT-ql0n83JJ78oYvDuRJ-Ebd4",
  authDomain: "bhartiya-bazar-9ef00.firebaseapp.com",
  projectId: "bhartiya-bazar-9ef00",
  storageBucket: "bhartiya-bazar-9ef00.firebasestorage.app",
  messagingSenderId: "1098988812349",
  appId: "1:1098988812349:web:693184d751ecd1251dd254",
  measurementId: "G-W4P4QV5WZH",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDb = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
