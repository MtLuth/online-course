import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { authClient } from "../firebase/firebaseClient.js";
import admin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";
import ErrorMessage from "../messages/errorMessage.js";
import User, { UserRole } from "../model/userModel.js";

class AuthService {
  constructor() {
    this.authAdmin = admin.auth();
    this.firestore = admin.firestore();
  }
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
        throw new AppError(`${error.code}`, 500);
      }
    }
  }

  async createUser(password, newUser) {
    try {
      const userRecord = await this.authAdmin.createUser({
        email: newUser.email,
        password: password,
        emailVerified: false,
        displayName: newUser.fullName,
      });

      const emailLink = await this.authAdmin.generateEmailVerificationLink(
        newUser.email
      );

      const userRef = this.firestore.collection("users").doc(userRecord.uid);
      const user = new User(
        userRecord.uid,
        newUser.fullName,
        newUser.email,
        "inactive",
        UserRole.Student
      );
      const userFirestore = user.toFirestore();
      await userRef.set(userFirestore);
      return {
        user,
        emailLink,
      };
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        throw new AppError(ErrorMessage.EmailAlreadyExist, 500);
      }
      throw new AppError(ErrorMessage.Internal, 500);
    }
  }

  async resetPassword() {
    try {
    } catch (error) {}
  }
}

export default new AuthService();
