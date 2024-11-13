import e from "express";
import instructorController from "../controllers/instructorController.js";
import pagination from "../middleware/paginateMiddleware.js";

const instructorRouter = e.Router();

instructorRouter
  .route("/")
  .get(instructorController.getAllInstructor, pagination);

export default instructorRouter;
