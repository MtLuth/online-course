import serviceAccount from "./../firebase-admin.json" with { type: "json" };
import admin from "firebase-admin";

export default admin.initializeApp(serviceAccount);
