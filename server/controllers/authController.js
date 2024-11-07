import ErrorMessage from "../messages/errorMessage.js";
import { User } from "../model/userModel.js";
import authService from "../services/authServices.js";
import catchAsync from "../utils/catchAsync.js";
import yup from "yup";
import YupPassword from "yup-password";

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
  confirm_password: yup
    .string()
    .label("confirm password")
    .required(ErrorMessage.ConfirmPasswordIsRequired)
    .oneOf([yup.ref("password"), null], ErrorMessage.PasswordNotMatch),
  fullName: yup
    .string()
    .label("full name")
    .required(ErrorMessage.FullNameIsRequired),
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
    const { email, password, confirmPassword, fullName } =
      await registerParam.validate(req.body, {
        abortEarly: true,
        strict: true,
      });

    console.log(fullName);
    console.log(email);

    const user = new User(null, fullName, email);

    const newUser = await authService.createUser(password, user);
    return res.status(200).json({
      status: "Successfully",
      message: newUser,
    });
  });
}

export default AuthController;
