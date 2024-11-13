import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "../routes/authRoutes.js";
import AppError from "../utils/appError.js";
import handleGlobalError from "../controllers/globalErrorHandler.js";
import dotenv from "dotenv";
import cookiesPareser from "cookie-parser";
import userRouter from "../routes/userRoutes.js";
import uploadRouter from "../routes/uploadRoutes.js";
import courseRouter from "../routes/courseRoutes.js";
import instructorRouter from "../routes/instructorRoutes.js";
import paginate from "express-paginate";

dotenv.config("./../config.env");

const app = express();

app.use(cookiesPareser());
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(paginate.middleware(5, 50));

const apiUrlGroup = "/api/v1";

app.use(`${apiUrlGroup}/auth`, authRouter);
app.use(`${apiUrlGroup}/user`, userRouter);
app.use(`${apiUrlGroup}/upload`, uploadRouter);
app.use(`${apiUrlGroup}/course`, courseRouter);
app.use(`${apiUrlGroup}/instructor`, instructorRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(handleGlobalError);

export default app;
