import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBsO-89b2az-QzbkdsomiKad-cr_hgSJmc',
  authDomain: 'sample-3ee36.firebaseapp.com',
  databaseURL: 'https://sample-3ee36-default-rtdb.firebaseio.com',
  projectId: 'sample-3ee36',
  storageBucket: 'sample-3ee36.appspot.com',
  messagingSenderId: '76798191986',
  appId: '1:76798191986:web:5020747b5b2866fa2cd5eb',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database
const db = getDatabase(app);
export { db };
