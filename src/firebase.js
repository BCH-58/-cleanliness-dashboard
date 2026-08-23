import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBW4oqMg3TUIzyXXxP--jluUtq3aGqNjRY',
  authDomain: 'm-bch-91d7c.firebaseapp.com',
  databaseURL: 'https://m-bch-91d7c-default-rtdb.firebaseio.com',
  projectId: 'm-bch-91d7c',
  storageBucket: 'm-bch-91d7c.firebasestorage.app',
  messagingSenderId: '749227394895',
  appId: '1:749227394895:web:4f57f6f5e7980884bae73a',
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
