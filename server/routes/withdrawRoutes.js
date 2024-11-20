import e from "express";
import withdrawController from "../controllers/withdrawController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import pagination from "../middleware/paginateMiddleware.js";

const withdrawRouter = e.Router();

withdrawRouter
  .route("/")
  .post(authMiddleware.validateUser, withdrawController.createRequest);

withdrawRouter
  .route("/admin")
  .get(
    authMiddleware.validateUser,
    authMiddleware.validateRoleAdmin,
    withdrawController.adminGetAllRequest,
    pagination
  );

withdrawRouter
  .route("/admin/:id")
  .put(
    authMiddleware.validateUser,
    authMiddleware.validateRoleAdmin,
    withdrawController.adminUpdateStatus
  )
  .get(withdrawController.getWithdrawById);

export default withdrawRouter;
