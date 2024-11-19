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
import cartRouter from "../routes/cartRoutes.js";
import purchaseRouter from "../routes/purchaseRoutes.js";
import paymentRoutes from "../routes/paymentRoutes.js";
import categoryRouter from "../routes/categoryRoutes.js";
import myLearningsRouter from "../routes/myLearningsRoutes.js";
import messageRouter from "../routes/messageRoutes.js";
import incomeRouter from "../routes/incomeRoutes.js";
import walletRouter from "../routes/walletRoutes.js";
import refundRouter from "../routes/refundRoutes.js";

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
app.use(`${apiUrlGroup}/cart`, cartRouter);
app.use(`${apiUrlGroup}/purchase`, purchaseRouter);
app.use(`${apiUrlGroup}/payment`, paymentRoutes);
app.use(`${apiUrlGroup}/category`, categoryRouter);
app.use(`${apiUrlGroup}/mylearnings`, myLearningsRouter);
app.use(`${apiUrlGroup}/message`, messageRouter);
app.use(`${apiUrlGroup}/income`, incomeRouter);
app.use(`${apiUrlGroup}/wallet`, walletRouter);
app.use(`${apiUrlGroup}/refund`, refundRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(handleGlobalError);

export default app;
