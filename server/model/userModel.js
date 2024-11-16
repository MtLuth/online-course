import firebaseAdmin from "../firebase/firebaseAdmin.js";

const UserRole = {
  Admin: "admin",
  Student: "student",
  Teacher: "teacher",
};

const auth = firebaseAdmin.auth();
const dbRef = firebaseAdmin.firestore().collection("users");
class User {
  constructor(uid, fullName, email, password, phoneNumber, role, avt) {
    this.uid = uid || null;
    this.fullName = fullName || null;
    this.email = email || null;
    this.phoneNumber = phoneNumber || null;
    this.password = password || null;
    this.role = role || UserRole.Student;
    this.avt =
      avt ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png";
  }

  toFirestore() {
    return {
      role: this.role,
    };
  }
  static fromFirestore(snapshot) {
    const data = snapshot.data();
    const user = new User();
    user.role = data.role;
    user.uid = snapshot.id;
    return user;
  }

  // async createAccount(disable) {
  //   const accountRecord = await auth.createUser({
  //     email: this.email,
  //     password: this.password,
  //     displayName: this.fullName,
  //     emailVerified: false,
  //     disabled: disable,
  //   });
  //   await dbRef.doc(accountRecord.uid).set(this.toFirestore());
  //   return accountRecord.uid;
  // }

  // static async getUserByUid(uid) {
  //   console.log(uid);
  //   const credential = await firebaseAdmin.auth().getUser(uid);
  //   const dbRef = firebaseAdmin.firestore().collection("users");
  //   const snapshot = await dbRef.doc(uid).get();
  //   const user = snapshot.data();
  //   return new User(
  //     credential.uid,
  //     credential.fullName,
  //     credential.email,
  //     null,
  //     credential.phoneNumber,
  //     user.role,
  //     credential.photoURL
  //   );
  // }

  // static async getRoleById(uid) {
  //   const snapshot = await dbRef.doc(uid).get();
  //   return snapshot.data().role;
  // }

  // static async deleteUserById(uid) {
  //   await dbRef.doc(uid).delete();
  // }
}

export default User;
export { UserRole };
