import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";
import type { FirebaseStorage } from "firebase/storage";

export const firebaseApp: FirebaseApp;
export const firebaseAuth: Auth;
export const firebaseDb: Firestore;
export const firebaseStorage: FirebaseStorage;
export const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};
