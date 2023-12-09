import {initializeApp, getApp, getApps} from 'firebase/app';
import { getDatabase }  from 'firebase/database';
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';

// UPDATE THIS WITH YOUR PROJECT SPECIFIC
const firebaseConfig = {
  apiKey: "AIzaSyBE1XOf1oQhfQPFVx8sEMFVsYAQVltIbwc",
  authDomain: "emergency-app-59aa4.firebaseapp.com",
  projectId: "emergency-app-59aa4",
  storageBucket: "emergency-app-59aa4.appspot.com",
  messagingSenderId: "804503793609",
  appId: "1:804503793609:web:2cb7bc454dcbd517f10218",
  measurementId: "G-N3E0XM6KRQ"
};


var app;
if (!getApps().length){
  app = initializeApp(firebaseConfig); // If no app exists.
}
else{
  const APPS = getApps();
  app = APPS[0]; // Choose the first app from the array.
}

export const db = getDatabase(app); // reatime db   
export const auth = getAuth(app); // auth
export const firestore = getFirestore(app); // firestore