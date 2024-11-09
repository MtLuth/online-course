import ErrorMessage from "../messages/errorMessage.js";
import User from "../model/userModel.js";
import authService from "../services/authServices.js";
import catchAsync from "../utils/catchAsync.js";
import yup, { bool } from "yup";
import YupPassword from "yup-password";
import { mailOptions, sendEmail } from "../services/emailService.js";

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
    .required(ErrorMessage.PhoneNumberIsRequired)
    .matches(/^[0-9]+$/, ErrorMessage.PhoneNumberInvalid)
    .min(10, ErrorMessage.PhoneNumberTooShort)
    .max(11, ErrorMessage.PhoneNumberTooLong),
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
    try {
      // In ra req.body để kiểm tra dữ liệu mà server nhận được từ client
      console.log('Request Body:', req.body);

      const { email, password, confirmPassword, fullName, phoneNumber } =
        await registerParam.validate(req.body, {
          abortEarly: true,
          strict: true,
        });

      // Kiểm tra dữ liệu sau khi đã validate thành công
      console.log('Validated Data:', { email, password, confirmPassword, fullName, phoneNumber });

      const user = new User(null, fullName, email, "inactive", phoneNumber);
      const newUser = await authService.createUser(password, user);

      return res.status(200).json({
        status: "Successfully",
        message: newUser,
      });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({
        status: "error",
        message: error.message || "Lỗi server",
      });
    }
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
}

export default AuthController;
