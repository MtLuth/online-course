import express from "express";
import authController from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", authController.Login);
authRouter.post("/register", authController.Register);

export default authRouter;
