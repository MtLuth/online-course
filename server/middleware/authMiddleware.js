import catchAsync from "../utils/catchAsync.js";
import firebaseAdmin from "../firebase/firebaseAdmin.js";
import {} from "firebase/auth";
import AppError from "../utils/appError.js";
import ErrorMessage from "../messages/errorMessage.js";

const validateUser = catchAsync(async (req, res, next) => {
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
});

export { validateUser };
