import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import purchaseController from "../controllers/purchaseController.js";

const purchaseRouter = e.Router();

purchaseRouter
  .route("/")
  .post(authMiddleware.validateUser, purchaseController.purchaseCourse)
  .get(authMiddleware.validateUser, purchaseController.getAllHistory);

export default purchaseRouter;
