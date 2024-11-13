import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseAdmin from "./firebaseAdmin.js";
import { UserRole } from "../model/userModel.js";
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
onAuthStateChanged(authClient, async (user) => {
  if (user) {
    const doc = await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get();
    const role = doc.data().role;
    if (role === UserRole.Student) {
      const snapshot = await firebaseAdmin
        .firestore()
        .collection("cart")
        .doc(user.uid)
        .get();
      if (!snapshot.exists) {
        await firebaseAdmin
          .firestore()
          .collection("cart")
          .doc(user.uid)
          .set({ courses: {}, total: 0 });
      }
    }
  }
});
const firestore = getFirestore(client);
const storage = getStorage(client);

export { authClient, firestore, storage };
