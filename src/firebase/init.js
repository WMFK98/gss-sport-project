// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore" ;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJraQGr9rJZZeNTrrQIc0hJ4WUotcEuVc",
  authDomain: "int305fb-11667.firebaseapp.com",
  projectId: "int305fb-11667",
  storageBucket: "int305fb-11667.firebasestorage.app",
  messagingSenderId: "571488475308",
  appId: "1:571488475308:web:c790562063a70193782709",
  measurementId: "G-ZL6SD61WW5"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// init firestore service
const db = getFirestore()

export default db 

