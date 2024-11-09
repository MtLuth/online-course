import express from "express";
import userController from "../controllers/userController.js";
import { validateUser } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.route("/profile").get(validateUser, userController.getProfile);

export default userRouter;
