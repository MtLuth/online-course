import e from "express";
import { validateUser } from "../middleware/authMiddleware.js";
import courseController from "../controllers/courseController.js";

const courseRouter = e.Router();

courseRouter.route("/").post(validateUser, courseController.createCourse);

export default courseRouter;
