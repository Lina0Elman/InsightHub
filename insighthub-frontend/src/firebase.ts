import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCyeT9neS1PVjnfEZh8Ftzh_Wbghs8yzKg",
    authDomain: "insighthub-3143b.firebaseapp.com",
    projectId: "insighthub-3143b",
    storageBucket: "insighthub-3143b.firebasestorage.app",
    messagingSenderId: "68649233569",
    appId: "1:68649233569:web:6131349a6afe37941114e0",
    measurementId: "G-CV8LE63BX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();