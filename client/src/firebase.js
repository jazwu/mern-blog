// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b539c.firebaseapp.com",
  projectId: "mern-blog-b539c",
  storageBucket: "mern-blog-b539c.appspot.com",
  messagingSenderId: "580310601218",
  appId: "1:580310601218:web:5dae89044a22560617211b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);