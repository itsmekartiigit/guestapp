import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyAIpVWuHDQdwkaXKhVFefSkZC1HLLBJ-vE',
  authDomain: 'wedding-app-on-air.firebaseapp.com',
  projectId: 'wedding-app-on-air',
  storageBucket: 'wedding-app-on-air.firebasestorage.app',
  messagingSenderId: '1088226858590',
  appId: '1:1088226858590:web:3cff25d51e8ac2252506cf',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'asia-south1');
