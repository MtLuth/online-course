import e from "express";
import instructorController from "../controllers/instructorController.js";

const instructorRouter = e.Router();

instructorRouter.route("/").get(instructorController.getAllInstructor);

export default instructorRouter;
