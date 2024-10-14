// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getQueriesForElement } from "@testing-library/react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPFWqOgLA8mK5pHRSa5OdKAupcEKynzog",
  authDomain: "surfelgulfdash.firebaseapp.com",
  projectId: "surfelgulfdash",
  storageBucket: "surfelgulfdash.appspot.com",
  messagingSenderId: "63522696166",
  appId: "1:63522696166:web:5dbb0a3d463115ef5ec427",
  measurementId: "G-YRSQN1C63M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db};
