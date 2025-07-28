import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBYSeyZME2FHd3_BPZr-i22N9k987x1bVg",
    authDomain: "nsmq-recruitment-app.firebaseapp.com",
    projectId: "nsmq-recruitment-app",
    storageBucket: "nsmq-recruitment-app.firebasestorage.app",
    messagingSenderId: "996745788782",
    appId: "1:996745788782:web:90319e0e883d1cd291157f"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);