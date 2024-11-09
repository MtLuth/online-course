import express from "express";
import authController from "../controllers/authController.js";
import { validateUser } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", authController.Login);
authRouter.post("/register", authController.Register);
authRouter.post("/send-email", authController.SendEmailActive);
authRouter.get("/reset-password", authController.GetCurrentUser);

export default authRouter;
