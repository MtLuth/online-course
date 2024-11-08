import express from "express";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", authController.Login);
authRouter.post("/register", authController.Register);
authRouter.post("/send-email", authController.SendEmailActive);
authRouter.get("/:uid", authController.GetAccountByUid);

export default authRouter;
