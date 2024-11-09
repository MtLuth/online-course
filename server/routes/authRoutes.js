import express from "express";
import authController from "../controllers/authController.js";
import { validateUser } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", authController.Login);
authRouter.post("/register", authController.Register);
authRouter.post(
  "/send-email/reset-password",
  authController.SendEmailResetPassword
);
authRouter.post("/reset-password/:token", authController.ResetPassword);

export default authRouter;
