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
  )
  .get(
    authMiddleware.validateUser,
    authMiddleware.validateRoleInstructor,
    courseController.getCourseById
  );

courseRouter.put(
  "/manage/update-status/:id",
  authMiddleware.validateUser,
  authMiddleware.validateRoleInstructor,
  courseController.updateCourseStatus
);

courseRouter.get(
  "/:courseId",
  authMiddleware.validateUser,
  courseController.studentGetCourseById
);

courseRouter
  .route("/rating/:courseId")
  .post(authMiddleware.validateUser, courseController.studentRatingCourse)
  .put(authMiddleware.validateUser, courseController.studentEditRatingCourse);

courseRouter.get("/", courseController.getAllCourse, pagination);

export default courseRouter;
