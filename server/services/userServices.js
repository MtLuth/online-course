import firebaseAdmin from "../firebase/firebaseAdmin.js";
import User from "../model/userModel.js";
import AppError from "../utils/appError.js";

class UserService {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("users");
  }
  async getProfileById(uid) {
    try {
      const profileDoc = await this.dbRef.doc(uid).get();
      const profile = User.fromFirestore(profileDoc);
      return profile;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new UserService();
