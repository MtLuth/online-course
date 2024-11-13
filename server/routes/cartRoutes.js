import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import cartController from "../controllers/cartController.js";

const cartRouter = e.Router();

cartRouter.post(
  "/add/:courseId",
  authMiddleware.validateUser,
  authMiddleware.validateRoleStudent,
  cartController.addCourse
);

export default cartRouter;
