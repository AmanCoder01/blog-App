
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-26eb9.firebaseapp.com",
  projectId: "blog-26eb9",
  storageBucket: "blog-26eb9.appspot.com",
  messagingSenderId: "134761218625",
  appId: "1:134761218625:web:974b39697bdd36d11efcc0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

