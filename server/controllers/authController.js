import ErrorMessage from "../messages/errorMessage.js";
import authService from "../services/authServices.js";
import catchAsync from "../utils/catchAsync.js";
import { mailOptions, sendEmail } from "../services/emailService.js";
import yup from "yup";
import {
  becomeInstructorParam,
  loginParam,
  registerParam,
} from "../validator/validationSchema.js";

class AuthController {
  Login = catchAsync(async (req, res, next) => {
    const { email, password } = await loginParam.validate(req.body, {
      abortEarly: true,
      strict: true,
    });
    const result = await authService.validateUser(email, password);

    res.status(200).json({
      status: "success",
      message: result,
    });
  });

  Register = catchAsync(async (req, res, next) => {
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

  GetCurrentUser = catchAsync(async (req, res, next) => {
    res.json(await authService.resetPassword);
  });

  SendEmailActive = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    console.log(email);
    const options = mailOptions(email, "Test", "Hiiii");
    await sendEmail(options);
    return res.status(200).json({
      status: "Successfully",
      message: "OK",
    });
  });

  ResetPassword = catchAsync(async (req, res, next) => {
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

  SendEmailResetPassword = catchAsync(async (req, res, next) => {
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

  BecomeInstructor = catchAsync(async (req, res, next) => {
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

  AdminCheckInstructor = catchAsync(async (req, res, next) => {
    const statusValidate = yup
      .string()
      .required(ErrorMessage.StatusIsRequired)
      .oneOf(["approve", "reject"], ErrorMessage.InvalidStatus);
    const uid = req.params.uid;
    const status = await statusValidate.validate(req.body.status);
    let state = {
      status: "",
      reason: "",
    };
    state.status = status;
    if (status === "reject") {
      const reasonValidate = yup
        .string()
        .required("Vui lòng nhập lý do!")
        .min(10);
      const reason = await reasonValidate.validate(req.body.reason);
      state.reason = reason;
    }
    const result = await authService.adminCheckInstructor(uid, state);
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });
}

export default new AuthController();
