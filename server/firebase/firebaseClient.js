import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "online-course-56226.firebaseapp.com",
  projectId: "online-course-56226",
  storageBucket: "online-course-56226.firebasestorage.app",
  messagingSenderId: "115147667851",
  appId: "1:115147667851:web:c39748dbdee3539b72578e",
  measurementId: "G-BM2379NC6W",
};

const client = initializeApp(firebaseConfig);
const authClient = getAuth(client);
const firestore = getFirestore(client);

export { authClient, firestore };
