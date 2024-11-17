import firebaseAdmin from "../firebase/firebaseAdmin.js";
import User from "../model/userModel.js";
import userRepo from "../repository/userRepo.js";
import AppError from "../utils/appError.js";

class UserService {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("users");
  }
  async getProfileById(uid) {
    try {
      const user = await userRepo.getUserByUid(uid);
      console.log(user);
      return user;
    } catch (error) {
      console.log(error);
      throw new AppError(error, 500);
    }
  }

  async updateProfileById(uid, newData) {
    try {
      const validKey = ["displayName", "phoneNumber", "photoURL"];
      const filteredData = Object.keys(newData).reduce((acc, key) => {
        if (validKey.includes(key)) {
          acc[key] = newData[key];
        }
        return acc;
      }, {});
      const message = await userRepo.updateAccount(uid, filteredData);
      return message;
    } catch (error) {
      throw new AppError(`Không thể cập nhật thông tin: ${error}`, 500);
    }
  }
}

export default new UserService();
