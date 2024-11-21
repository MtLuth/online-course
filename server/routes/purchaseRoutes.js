import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import purchaseController from "../controllers/purchaseController.js";
import paymentController from "../controllers/paymentController.js";

const purchaseRouter = e.Router();

purchaseRouter
  .route("/")
  .post(
    authMiddleware.validateUser,
    purchaseController.purchaseCourse,
    paymentController.createPaymentLink
  )
  .get(authMiddleware.validateUser, purchaseController.getAllHistory);

export default purchaseRouter;
