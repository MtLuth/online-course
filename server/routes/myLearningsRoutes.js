import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import myLearningController from "../controllers/myLearningController.js";

const myLearningsRouter = e.Router();

myLearningsRouter.get(
  "/",
  authMiddleware.validateUser,
  myLearningController.getAllCourses
);

export default myLearningsRouter;
