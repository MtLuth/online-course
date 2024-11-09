import accountService from "./../firebase-admin.json" with { type: "json" };
import admin from "firebase-admin";

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(accountService),
});

export default firebaseAdmin;
