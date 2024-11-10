import firebaseAdmin from "../firebase/firebaseAdmin.js";
import User from "../model/userModel.js";
import AppError from "../utils/appError.js";

class UserService {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("users");
  }
  async getProfileById(uid) {
    try {
      const user = await User.getUserByUid(uid);
      return user;
    } catch (error) {
      console.log(error);
      throw new AppError(error, 500);
    }
  }
}

export default new UserService();
