import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import paymentController from "../controllers/paymentController.js";

const paymentRoutes = e.Router();

paymentRoutes.post(
  "/create-payment-link",
  authMiddleware.validateUser,
  paymentController.createPaymentLink
);

paymentRoutes.post("/call-back", paymentController.callbackUrl);

export default paymentRoutes;
