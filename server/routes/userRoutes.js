import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter
  .route("/profile/:uid")
  .get(authMiddleware.validateUser, userController.getProfile);

userRouter
  .route("/profile")
  .post(authMiddleware.validateUser, userController.updateProfile);

export default userRouter;
