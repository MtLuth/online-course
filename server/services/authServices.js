import { signInWithEmailAndPassword } from "firebase/auth";
import admin from "../firebase/firebaseAdmin.js";
import { authClient } from "../firebase/firebaseClient.js";
import AppError from "../utils/appError.js";
import ErrorMessage from "../messages/errorMessage.js";

class AuthService {
  async validateUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        authClient,
        email,
        password
      );
      return userCredential;
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        throw new AppError(ErrorMessage.InvalidCredential, 401);
      } else if (error.code === "auth/user-not-found") {
        throw new AppError(ErrorMessage.UserNotFound, 404);
      } else {
        throw new AppError("Đã xảy ra lỗi xác thực", 500);
      }
    }
  }
}

export default new AuthService();
