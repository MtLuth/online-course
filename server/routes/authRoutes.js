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

authRouter.post("/become-instructor", authController.BecomeInstructor);

authRouter.post("/reset-password/:token", authController.ResetPassword);
authRouter.route("/profile").get(validateUser);
export default authRouter;
