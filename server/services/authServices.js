import {
  setPersistence,
  signInWithEmailAndPassword,
  browserLocalPersistence,
} from "firebase/auth";
import { authClient } from "../firebase/firebaseClient.js";
import admin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";
import ErrorMessage from "../messages/errorMessage.js";
import User, { UserRole } from "../model/userModel.js";
import tokenServices from "./tokenServices.js";
import {
  getEmailTemplateActive,
  getEmailTemplateResetPassword,
  getTemplateAdminCheckInstructor,
  mailOptions,
  sendEmail,
} from "./emailService.js";
import Instructor, { InstructorStatus } from "../model/instructorModel.js";
import userRepo from "../repository/userRepo.js";
import instructorRepo from "../repository/instructorRepo.js";

class AuthService {
  constructor() {
    this.authAdmin = admin.auth();
    this.firestore = admin.firestore();
  }
  async validateUser(email, password) {
    try {
      await setPersistence(authClient, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        authClient,
        email,
        password
      );

      const user = userCredential.user;
      if (!user.emailVerified) {
        throw new AppError("Email chưa được xác minh", 400);
      }
      const dbRef = this.firestore.collection("users");
      const doc = await dbRef.doc(user.uid).get();
      const role = doc.data().role;
      const result = {
        uid: user.uid,
        email: user.email,
        role: role,
        tokenPairs: user.stsTokenManager,
      };
      return result;
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        throw new AppError(ErrorMessage.InvalidCredential, 401);
      } else if (error.code === "auth/user-not-found") {
        throw new AppError(ErrorMessage.UserNotFound, 404);
      } else if (error.code === "app/invalid-credential") {
        throw new AppError(ErrorMessage.UserInactive, 401);
      } else if (error.code === "auth/user-disabled") {
        throw new AppError(ErrorMessage.ClockedUser, 401);
      } else if (error.code === "auth/invalid-credential") {
        throw new AppError(ErrorMessage.InvalidCredential, 400);
      } else {
        throw new AppError(`${error.code}`, 500);
      }
    }
  }

  async createUser(email, fullName, password, phoneNumber) {
    try {
      const account = new User();
      account.fullName = fullName;
      account.email = email;
      account.avt =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png";
      account.phoneNumber = phoneNumber;
      account.role = UserRole.Student;
      account.password = password;

      await userRepo.createAccount(account, false);

      const emailLink =
        await this.authAdmin.generateEmailVerificationLink(email);

      const mailContent = getEmailTemplateActive(emailLink);
      const mailDialup = mailOptions(email, "Active Account", mailContent);
      await sendEmail(mailDialup);

      return "Vui lòng kiểm tra email của bạn để kích hoạt tài khoản!";
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        throw new AppError(ErrorMessage.EmailAlreadyExist, 500);
      }
      throw new AppError(error, 500);
    }
  }

  async becomeInstructors(
    email,
    password,
    fullName,
    avt,
    bio,
    expertise,
    experience,
    education,
    certificages,
    rating,
    review
  ) {
    try {
      const account = new User();
      account.email = email;
      account.password = password;
      account.avt = avt;
      account.fullName = fullName;
      account.role = UserRole.Teacher;
      const uid = await userRepo.createAccount(account);
      const newInstructor = new Instructor(
        uid,
        email,
        InstructorStatus.Pending,
        fullName,
        avt,
        bio,
        expertise,
        experience,
        education,
        certificages,
        rating,
        review
      );
      await newInstructor.save();
      return "Thông tin của bạn đã được gửi admin và chờ kiểm duyệt!";
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        throw new AppError(ErrorMessage.EmailAlreadyExist, 500);
      }
      throw new AppError(`${ErrorMessage.Internal}: ${error}`, 500);
    }
  }

  async sendEmailResetPassword(email) {
    try {
      const user = await this.authAdmin.getUserByEmail(email);
      const resetToken = tokenServices.createToken(email, user.uid);
      await tokenServices.save(resetToken);
      setTimeout(async () => {
        await tokenServices.delete(resetToken);
      }, 1000 * 300);
      const content = getEmailTemplateResetPassword(
        `http://localhost:3000/resetpassword/${resetToken.value}`
      );
      console.log(resetToken);
      const mailDialup = mailOptions(email, "Reset Password", content);
      await sendEmail(mailDialup);
      return ErrorMessage.SendEmailPasswordSuccessfully;
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        throw new AppError(ErrorMessage.EmailNotFound, 400);
      }
      throw new AppError(`${ErrorMessage.Internal}: ${error}`, 500);
    }
  }

  async resetPassword(token, password) {
    try {
      const validateToken = await tokenServices.findByValue(token);
      if (validateToken === null) {
        throw new AppError(ErrorMessage.LinkExpired, 400);
      }
      console.log(Date.now(), validateToken.expiredAt);
      if (Date.now() > validateToken.expiredAt) {
        throw new AppError(ErrorMessage.LinkExpired, 400);
      }
      const uid = validateToken.uid;
      await this.authAdmin.updateUser(uid, {
        password: password,
      });
      return "Thay đổi mật khẩu mới thành công";
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`${ErrorMessage.Internal}: ${error}`, 500);
    }
  }

  async adminCheckInstructor(uid, state) {
    try {
      var sendEmailState;
      const instructor = await this.authAdmin.getUser(uid);
      if (state.status === "approve") {
        await Promise.all([
          this.authAdmin.updateUser(uid, {
            disabled: false,
          }),
          instructorRepo.updateStatus(uid, InstructorStatus.Inactive),
        ]);
        const emailLink = await this.authAdmin.generateEmailVerificationLink(
          instructor.email
        );
        sendEmailState = {
          ...state,
          emailLink: emailLink,
        };
      } else {
        await Promise.all([
          this.authAdmin.deleteUser(uid),
          this.firestore.collection("instructors").doc(uid).delete(),
        ]);

        sendEmailState = {
          ...state,
        };
      }
      const content = getTemplateAdminCheckInstructor(sendEmailState);
      const mailDialup = mailOptions(instructor.email, "Active User", content);
      await sendEmail(mailDialup);
      return "Thành công!";
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        throw new AppError("Không tìm thấy tài khoản này trên hệ thống!", 500);
      }
      throw new AppError(error, 500);
    }
  }

  async newPassword(uid, oldPassword, newPassword) {
    try {
      const message = await userRepo.newPassword(uid, oldPassword, newPassword);
      return message;
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        throw new AppError("Mật khẩu cũ không chính xác!", 400);
      }
      throw new AppError(error, 500);
    }
  }
}

export default new AuthService();
