import e from "express";
import walletController from "../controllers/walletController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const walletRouter = e.Router();

walletRouter
  .route("/")
  .post(walletController.updateWallet)
  .get(authMiddleware.validateUser, walletController.getWallet);

export default walletRouter;
