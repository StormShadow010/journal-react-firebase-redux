// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBUObCgrLDgij3J3rs4P-0Bh255gv2i5w",
  authDomain: "react-cursos-ce319.firebaseapp.com",
  projectId: "react-cursos-ce319",
  storageBucket: "react-cursos-ce319.appspot.com",
  messagingSenderId: "99500516242",
  appId: "1:99500516242:web:0741a9cc53d3593b45174b"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getFirestore(FirebaseApp);