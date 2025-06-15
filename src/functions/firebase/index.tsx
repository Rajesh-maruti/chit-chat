// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaMNAchE9b9hgBUJMFksDOpH0k_IBfaQY",
  authDomain: "react-chat-663cd.firebaseapp.com",
  projectId: "react-chat-663cd",
  storageBucket: "react-chat-663cd.firebasestorage.app",
  messagingSenderId: "70989627400",
  appId: "1:70989627400:web:78f8ee330b8b11f631d1bd",
  measurementId: "G-V8SF9Z62JW",
  //   rules_version = '2';

  // // service firebase.storage {
  // //   match /b/{bucket}/o {
  // //     match /{allPaths=**} {
  // //       allow read, write: if false;
  // //     }
  // //   }
  // }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
