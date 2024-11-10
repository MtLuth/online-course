import express from "express";
import userController from "../controllers/userController.js";
import {
  validateRoleStudent,
  validateUser,
} from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.route("/profile/:uid").get(validateUser, userController.getProfile);

export default userRouter;
