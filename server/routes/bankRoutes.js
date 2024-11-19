import e from "express";
import bankController from "../controllers/bankController.js";

const bankRouter = e.Router();

bankRouter.get("/", bankController.getAllBanks);

export default bankRouter;
