import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "../routes/authRoutes.js";
import AppError from "../utils/appError.js";
import handleGlobalError from "../controllers/globalErrorHandler.js";
import dotenv from "dotenv";

dotenv.config("./../config.env");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const apiUrlGroup = "/api/v1";

app.use(`${apiUrlGroup}/auth`, authRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(handleGlobalError);

export default app;
