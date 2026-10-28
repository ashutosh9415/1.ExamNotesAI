import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotes-ef1cb.firebaseapp.com",
  projectId: "authexamnotes-ef1cb",
  storageBucket: "authexamnotes-ef1cb.firebasestorage.app",
  messagingSenderId: "390441937052",
  appId: "1:390441937052:web:ff6e082bc013d3e0526559"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };