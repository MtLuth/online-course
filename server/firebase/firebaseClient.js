import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { UserRole } from "../model/userModel.js";
import firebaseAdmin from "./firebaseAdmin.js";
import instructorRepo from "../repository/instructorRepo.js";
import { InstructorStatus } from "../model/instructorModel.js";
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
      const cartRef = firebaseAdmin.firestore().collection("cart");
      const cartDoc = await cartRef.doc(user.uid).get();
      if (!cartDoc.exists) {
        await cartRef.doc(user.uid).set({
          courses: {},
          total: 0,
        });
      }
    }
    if (role === UserRole.Teacher) {
      if (user.emailVerified) {
        instructorRepo.updateStatus(InstructorStatus.Active);
      }
    }
  }
});
const firestore = getFirestore(client);
const storage = getStorage(client);

export { authClient, firestore, storage };
