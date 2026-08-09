import { getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBff2sG9MHkoMz0-KymjjFX3DVBcv74epY',
  authDomain: 'fxnewsnotifier.firebaseapp.com',
  databaseURL:
    'https://fxnewsnotifier-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'fxnewsnotifier',
  storageBucket: 'fxnewsnotifier.firebasestorage.app',
  messagingSenderId: '606928133803',
  appId: '1:606928133803:web:91a2fbacc8f96a3636e1ee',
  measurementId: 'G-ZZ7968B44E',
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const database = getDatabase(app);
