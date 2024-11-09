import admin from "firebase-admin";
import fs from "fs";

const accountService = JSON.parse(
  fs.readFileSync(
    "../server/online-course-56226-firebase-adminsdk-tpy1j-b563af60cc.json",
    "utf8"
  )
);

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(accountService),
});

export default firebaseAdmin;