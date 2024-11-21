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

refundRouter
  .route("/student")
  .get(
    authMiddleware.validateUser,
    refundController.getAllRefundsOfStudent,
    pagination
  );

refundRouter
  .route("/:id")
  .get(authMiddleware.validateUser, refundController.viewDetailRefund)
  .put(authMiddleware.validateUser, refundController.updateRefundStatus);

refundRouter.put(
  "/cancel/:id",
  authMiddleware.validateUser,
  refundController.studentCancelRefund
);

export default refundRouter;
