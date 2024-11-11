import catchAsync from "../utils/catchAsync.js";
import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";
import ErrorMessage from "../messages/errorMessage.js";
import User, { UserRole } from "../model/userModel.js";

const validateUser = catchAsync(async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      const token = req.headers.authorization.split(" ")[1];
      const valid = await firebaseAdmin.auth().verifyIdToken(token);
      req.uid = valid.sub;
      next();
    } else {
      return next(new AppError(ErrorMessage.Unauthorizaton, 401));
    }
  } catch (error) {
    console.log(error);
    throw new AppError(ErrorMessage.Unauthorizaton, 401);
  }
});

const validateRoleStudent = catchAsync(async (req, res, next) => {
  const uid = req.uid;
  const role = await User.getRoleById(uid);
  if (role !== UserRole.Student) {
    next(new AppError(ErrorMessage.InvalidRole, 401));
  }
  next();
});

export { validateUser, validateRoleStudent };
