import e from "express";
import walletController from "../controllers/walletController.js";

const walletRouter = e.Router();

walletRouter.route("/").post(walletController.updateWallet);

export default walletRouter;
