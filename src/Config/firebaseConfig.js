import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3wWaQcWx59X88kpLbvfambciVCkbdJkk",
    authDomain: "portfolio-razriz.firebaseapp.com",
    projectId: "portfolio-razriz",
    storageBucket: "portfolio-razriz.firebasestorage.app",
    messagingSenderId: "13673773358",
    appId: "1:13673773358:web:95f04bc961a837730562bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;