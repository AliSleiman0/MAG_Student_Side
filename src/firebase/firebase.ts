// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { browserLocalPersistence, getAuth, setPersistence, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDlJAn1I6NRfQdfyUJ9vy9YE9__HSBI4wg",
    authDomain: "mag-student-side.firebaseapp.com",
    projectId: "mag-student-side",
    storageBucket: "mag-student-side.firebasestorage.app",
    messagingSenderId: "246494652378",
    appId: "1:246494652378:web:ed5b784c09d1701f5602e3",
    measurementId: "G-H4E7SV3G7N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
 setPersistence(auth, browserLocalPersistence);
export { db, auth, signInAnonymously };