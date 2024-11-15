import firebaseAdmin from "../firebase/firebaseAdmin.js";

class UserRepo {
  constructor() {
    this.auth = firebaseAdmin.auth();
    this.dbRef = firebaseAdmin.firestore().collection("users");
  }

  async createAccount(user, disable) {
    const accountRecord = await this.auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.fullName,
      emailVerified: false,
      disabled: disable,
    });
    await this.dbRef.doc(accountRecord.uid).set(user.toFirestore());
    return accountRecord.uid;
  }

  async updateAccount() {
    const newAccout = {
      displayName: this.fullName,
      phoneNumber: this.phoneNumber,
      password: this.password,
      photoURL: this.avt,
    };
    await auth.updateUser(this.uid, newAccout);
  }

  static async getUserByUid(uid) {
    console.log(uid);
    const credential = await firebaseAdmin.auth().getUser(uid);
    const dbRef = firebaseAdmin.firestore().collection("users");
    const snapshot = await dbRef.doc(uid).get();
    const user = snapshot.data();
    return new User(
      credential.uid,
      credential.fullName,
      credential.email,
      null,
      credential.phoneNumber,
      user.role,
      credential.photoURL
    );
  }

  static async getRoleById(uid) {
    const snapshot = await dbRef.doc(uid).get();
    return snapshot.data().role;
  }

  static async deleteUserById(uid) {
    await dbRef.doc(uid).delete();
  }
}

export default new UserRepo();
