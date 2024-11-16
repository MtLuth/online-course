import firebaseAdmin from "../firebase/firebaseAdmin.js";
import User from "../model/userModel.js";

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

  async updateAccount(uid, newData) {
    await this.auth.updateUser(uid, { ...newData });
    return "Cập nhật thông tin mới thành công!";
  }

  async getUserByUid(uid) {
    const credential = await this.auth.getUser(uid);
    const snapshot = await this.dbRef.doc(uid).get();
    const user = snapshot.data();
    console.log(credential);
    return new User(
      credential.uid,
      credential.displayName,
      credential.email,
      null,
      credential.phoneNumber,
      user.role,
      credential.photoURL
    );
  }

  async getRoleById(uid) {
    const snapshot = await this.dbRef.doc(uid).get();
    return snapshot.data().role;
  }

  async deleteUserById(uid) {
    await this.dbRef.doc(uid).delete();
  }
}

export default new UserRepo();
