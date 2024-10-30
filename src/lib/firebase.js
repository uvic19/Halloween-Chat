import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "halloween-chat-854da.firebaseapp.com",
  projectId: "halloween-chat-854da",
  storageBucket: "halloween-chat-854da.appspot.com",
  messagingSenderId: "595376194097",
  appId: "1:595376194097:web:63200d72a2105a27f6cb10"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()