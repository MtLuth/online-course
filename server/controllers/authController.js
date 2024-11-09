import ErrorMessage from "../messages/errorMessage.js";
import User, { UserRole } from "../model/userModel.js";
import authService from "../services/authServices.js";
import catchAsync from "../utils/catchAsync.js";
import yup, { bool } from "yup";
import YupPassword from "yup-password";
import { mailOptions, sendEmail } from "../services/emailService.js";
import tokenServices from "../services/tokenServices.js";

YupPassword(yup);

const loginParam = yup.object().shape({
  email: yup
    .string()
    .required(ErrorMessage.EmailIsRequired)
    .email(ErrorMessage.EmailInvalid),
  password: yup.string().required(ErrorMessage.PasswordIsRequired),
});

const registerParam = yup.object().shape({
  email: yup
    .string()
    .required(ErrorMessage.EmailIsRequired)
    .email(ErrorMessage.EmailInvalid),
  password: yup.string().password().required(ErrorMessage.PasswordIsRequired),
  confirmPassword: yup
    .string()
    .label("confirm password")
    .required(ErrorMessage.ConfirmPasswordIsRequired)
    .oneOf([yup.ref("password"), null], ErrorMessage.PasswordNotMatch),
  fullName: yup
    .string()
    .label("full name")
    .required(ErrorMessage.FullNameIsRequired),
  phoneNumber: yup
    .string()
    .label("phone number")
    .required(ErrorMessage.PhoneNumberIsRequired),
});

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

    const newUser = new User(
      null,
      fullName,
      email,
      null,
      UserRole.Student,
      phoneNumber
    );
    const registerUser = await authService.createUser(password, newUser);
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
}

export default AuthController;
