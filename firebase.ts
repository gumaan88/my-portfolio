// @ts-ignore
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlh4e9HCJVfRgzWvA3P5V-zldsixWwLak",
  authDomain: "my-portfolio-gumaan.firebaseapp.com",
  projectId: "my-portfolio-gumaan",
  storageBucket: "my-portfolio-gumaan.firebasestorage.app",
  messagingSenderId: "377371543839",
  appId: "1:377371543839:web:68de86e8d4e24d2e97c82a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;