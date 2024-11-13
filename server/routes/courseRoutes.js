import e from "express";
import courseController from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import pagination from "../middleware/paginateMiddleware.js";

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
    courseController.getAllCourseOfInstructor,
    pagination
  );

courseRouter
  .route("/manage/:id")
  .put(
    authMiddleware.validateUser,
    authMiddleware.validateRoleInstructor,
    courseController.updateCourse
  );

courseRouter.put(
  "/manage/update-status/:id",
  authMiddleware.validateUser,
  authMiddleware.validateRoleInstructor,
  courseController.updateCourseStatus
);

courseRouter.get("/:id", courseController.getCourseById);

export default courseRouter;
