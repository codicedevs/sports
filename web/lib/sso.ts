// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQo1PphueP5izg06N8lUqlvQ1hWXTxxfw",
    authDomain: "sports-aa6e2.firebaseapp.com",
    projectId: "sports-aa6e2",
    storageBucket: "sports-aa6e2.firebasestorage.app",
    messagingSenderId: "445233524429",
    appId: "1:445233524429:web:679c90dacead707eb6c384",
    measurementId: "G-ECQ122WXQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
    app,
    auth,
    googleProvider
}