import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBEBlr6455VMMBKkEmGHB0c0SN-wbBfZk4",
  authDomain: "journalapp-bb379.firebaseapp.com",
  projectId: "journalapp-bb379",
  storageBucket: "journalapp-bb379.appspot.com",
  messagingSenderId: "1061072291524",
  appId: "1:1061072291524:web:ff93c16f6f5b5b6e56ab91",
  measurementId: "G-CYTCGSLYRK",
};

const client = initializeApp(firebaseConfig);
const authClient = getAuth(client);
const firestore = getFirestore(client);
const storage = getStorage(client);

export { authClient, firestore, storage };
