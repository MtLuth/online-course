import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import withdrawController from "../controllers/withdrawController.js";

const withdrawRouter = e.Router();

withdrawRouter
  .route("/")
  .post(authMiddleware.validateUser, withdrawController.createRequest);

export default withdrawRouter;
