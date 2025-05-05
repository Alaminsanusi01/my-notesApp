// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

 
import { getAuth } from "firebase/auth"; // Importing getAuth from firebase/auth
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl_jV4C75htPEnhquOtwTH_fH-_Q-bJ70",
  authDomain: "my-notesapp-697e3.firebaseapp.com",
  projectId: "my-notesapp-697e3",
  storageBucket: "my-notesapp-697e3.firebasestorage.app",
  messagingSenderId: "577136530372",
  appId: "1:577136530372:web:92f28a921dfd6205f3ca91",
  measurementId: "G-TE4B4JVSYN"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };