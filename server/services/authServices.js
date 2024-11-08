import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { authClient } from "../firebase/firebaseClient.js";
import admin from "./../firebase/firebaseAdmin.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseClient.js";
import AppError from "../utils/appError.js";
import ErrorMessage from "../messages/errorMessage.js";
import { User, userConverter } from "../model/userModel.js";

class AuthService {
  async validateUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        authClient,
        email,
        password
      );
      if (!userCredential.user.emailVerified) {
        throw new AppError("Email chưa được xác minh", 400);
      }
      return userCredential;
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        throw new AppError(ErrorMessage.InvalidCredential, 401);
      } else if (error.code === "auth/user-not-found") {
        throw new AppError(ErrorMessage.UserNotFound, 404);
      } else if (error.code === "app/invalid-credential") {
        throw new AppError(ErrorMessage.UserInactive, 401);
      } else {
        throw new AppError(`${error}`, 500);
      }
    }
  }

  async createUser(password, newUser) {
    try {
      console.log(newUser.email);
      const userCredential = await createUserWithEmailAndPassword(
        authClient,
        newUser.email,
        password
      );
      await sendEmailVerification(userCredential.user);
      const ref = doc(
        firestore,
        "users",
        userCredential.user.uid
      ).withConverter(userConverter);
      await setDoc(
        ref,
        new User(
          userCredential.user.uid,
          newUser.fullName,
          newUser.email,
          newUser.status
        )
      );
      return {
        uid: userCredential.user.uid,
        fullName: newUser.fullName,
        email: newUser.email,
      };
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async resendEmailActive() {
    try {
      const user = authClient.currentUser;
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
      }
    } catch (error) {
      throw new AppError(`Không thể gửi mail xác minh ${error.code}`);
    }
  }
}

export default new AuthService();
