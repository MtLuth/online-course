import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import incomeController from "../controllers/incomeController.js";
import pagination from "../middleware/paginateMiddleware.js";

const incomeRouter = e.Router();

incomeRouter
  .route("/")
  .get(authMiddleware.validateUser, incomeController.getAllIncomes, pagination);

incomeRouter
  .route("/:id")
  .get(authMiddleware.validateUser, incomeController.getIncomeById);

export default incomeRouter;
