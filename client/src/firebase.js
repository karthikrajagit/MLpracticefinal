// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl4uF2fa5un8FIBbCJ1XyrOnZaWuuvnIA",
  authDomain: "ml-practice-26a86.firebaseapp.com",
  projectId: "ml-practice-26a86",
  storageBucket: "ml-practice-26a86.firebasestorage.app",
  messagingSenderId: "60671040245",
  appId: "1:60671040245:web:4106dce6de417e213783bc",
  measurementId: "G-5JBG9YZ0NV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);