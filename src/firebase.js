// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCB7ELteps5YbLWgtytauaRz_m1x8PwKEE",
  authDomain: "fordchat-b65dc.firebaseapp.com",
  projectId: "fordchat-b65dc",
  storageBucket: "fordchat-b65dc.appspot.com",
  messagingSenderId: "331631796115",
  appId: "1:331631796115:web:542c63d502f2102a8a1266",
  measurementId: "G-TG9P5V7M2N"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export { firebase }