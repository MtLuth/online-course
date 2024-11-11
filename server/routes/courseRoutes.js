import e from "express";
import courseController from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const courseRouter = e.Router();

courseRouter
  .route("/")
  .post(authMiddleware.validateUser, courseController.createCourse);

export default courseRouter;
