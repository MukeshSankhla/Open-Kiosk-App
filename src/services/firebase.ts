
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { StoreSettings } from '@/types/store';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const initializeFirebase = (settings: StoreSettings) => {
  try {
    app = initializeApp(settings.firebaseConfig);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
    return { app, db };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

export const getFirebaseDb = (): Firestore => {
  if (!db) {
    throw new Error('Firebase not initialized. Please complete store setup first.');
  }
  return db;
};

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    throw new Error('Firebase not initialized. Please complete store setup first.');
  }
  return app;
};
