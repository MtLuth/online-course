import e from "express";
import courseController from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const courseRouter = e.Router();

courseRouter
  .route("/manage")
  .post(
    authMiddleware.validateUser,
    authMiddleware.validateRoleInstructor,
    courseController.createCourse
  )
  .get(
    authMiddleware.validateUser,
    authMiddleware.validateRoleInstructor,
    courseController.getAllCourseOfInstructor
  );

courseRouter
  .route("/manage/:id")
  .put(
    authMiddleware.validateUser,
    authMiddleware.validateRoleInstructor,
    courseController.updateCourseStatus
  );

courseRouter.get("/:id", courseController.getCourseById);

export default courseRouter;
