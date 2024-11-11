import ErrorMessage from "../messages/errorMessage.js";
import User, { UserRole } from "../model/userModel.js";
import authService from "../services/authServices.js";
import catchAsync from "../utils/catchAsync.js";
import { mailOptions, sendEmail } from "../services/emailService.js";
import tokenServices from "../services/tokenServices.js";
import {
  becomeInstructorParam,
  loginParam,
  registerParam,
} from "../validator/validationSchema.js";

class AuthController {
  static Login = catchAsync(async (req, res, next) => {
    const { email, password } = await loginParam.validate(req.body, {
      abortEarly: true,
      strict: true,
    });
    const result = await authService.validateUser(email, password);
    const user = result.user;
    const data = {
      uid: user.uid,
      email: user.email,
      tokenPairs: user.stsTokenManager,
    };
    res.status(200).json({
      status: "success",
      message: data,
    });
  });

  static Register = catchAsync(async (req, res, next) => {
    const { email, password, confirmPassword, fullName, phoneNumber } =
      await registerParam.validate(req.body);

    const registerUser = await authService.createUser(
      email,
      fullName,
      password,
      phoneNumber
    );
    res.status(200).json({
      status: "Successfully!",
      message: registerUser,
    });
  });

  static GetCurrentUser = catchAsync(async (req, res, next) => {
    res.json(await authService.resetPassword);
  });

  static SendEmailActive = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    console.log(email);
    const options = mailOptions(email, "Test", "Hiiii");
    await sendEmail(options);
    return res.status(200).json({
      status: "Successfully",
      message: "OK",
    });
  });

  static ResetPassword = catchAsync(async (req, res, next) => {
    const token = req.params.token;
    const validatePassword = yup
      .string()
      .password()
      .required(ErrorMessage.PasswordIsRequired);
    const password = await validatePassword.validate(req.body.password);
    const message = await authService.resetPassword(token, password);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  static SendEmailResetPassword = catchAsync(async (req, res, next) => {
    const validateParam = yup
      .string()
      .required(ErrorMessage.EmailIsRequired)
      .email(ErrorMessage.InvalidEmail);
    const email = await validateParam.validate(req.body.email);
    const message = await authService.sendEmailResetPassword(email);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  static BecomeInstructor = catchAsync(async (req, res, next) => {
    const {
      email,
      password,
      confirmPassword,
      fullName,
      bio,
      certificate,
      education,
      expertise,
      experience,
      avt,
    } = await becomeInstructorParam.validate(req.body, {
      abortEarly: true,
      strict: true,
    });
    const result = await authService.becomeInstructors(
      email,
      password,
      fullName,
      avt,
      bio,
      expertise,
      experience,
      education,
      certificate
    );
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });
}

export default AuthController;
