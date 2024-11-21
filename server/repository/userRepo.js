import firebaseAdmin from "../firebase/firebaseAdmin.js";
import User from "../model/userModel.js";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  EmailAuthCredential,
} from "firebase/auth";
import { authClient } from "../firebase/firebaseClient.js";
import AppError from "../utils/appError.js";

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
      photoURL: user.avt,
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

  async newPassword(uid, oldPassword, newPassword) {
    const account = await this.auth.getUser(uid);
    const email = account.email;
    const currentUser = authClient.currentUser;
    if (currentUser) {
      console.log("aaaa");
      const credential = EmailAuthProvider.credential(email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await this.auth.updateUser(uid, { password: newPassword });
      return "Cập nhật mật khẩu thành công!";
    }

    throw new AppError("Không thể lấy thông tin người dùng!", 400);
  }

  async getNumberOfRole() {
    let userRoles = {};
    console.log("aaaa");
    const snapshot = await this.dbRef.get();
    snapshot.docs.forEach((item) => {
      const role = item.data().role || "unknown";
      userRoles[role] = (userRoles[role] || 0) + 1;
    });
    return userRoles;
  }
}

export default new UserRepo();
