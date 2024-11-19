import e from "express";
import refundController from "../controllers/refundController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import pagination from "../middleware/paginateMiddleware.js";

const refundRouter = e.Router();

refundRouter
  .route("/")
  .post(authMiddleware.validateUser, refundController.createRefund)
  .get(
    authMiddleware.validateUser,
    authMiddleware.validateRoleAdmin,
    refundController.getAllRefundsByAdmin,
    pagination
  );

export default refundRouter;
