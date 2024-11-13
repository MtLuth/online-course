import crypto from "crypto";
import Token from "../model/tokenModel.js";
import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";
import ErrorMessage from "../messages/errorMessage.js";
import { AppErrorCodes } from "firebase-admin/app";

class TokenServices {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("tokens");
  }
  createToken(email, uid) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiredAt = Date.now() + 600 * 1000;

    return new Token(email, uid, resetToken, expiredAt);
  }

  async save(tokenModel) {
    try {
      await this.dbRef.doc(tokenModel.email).set(tokenModel.toFirestore());
    } catch (error) {
      throw new AppError(ErrorMessage.Internal, 500);
    }
  }

  async delete(tokenModel) {
    try {
      await this.dbRef.doc(tokenModel.email).delete();
      console.log("Đã xóa!");
    } catch (error) {
      console.log(error);
    }
  }

  async findByValue(tokenValue) {
    try {
      const querySnapshot = await this.dbRef
        .where("value", "==", tokenValue)
        .get();
      if (querySnapshot.empty) {
        return null;
      }

      const snapshot = querySnapshot.docs[0];
      return Token.fromFirestore(snapshot);
    } catch (error) {
      console.log("Lỗi khi tìm token:", error);
      throw new Error("Không thể tìm token.");
    }
  }
}

export default new TokenServices();
