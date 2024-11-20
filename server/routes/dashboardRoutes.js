import e from "express";
import dashboardController from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const dashboardRouter = e.Router();

dashboardRouter.get("/admin", dashboardController.dashboardAdmin);
dashboardRouter.get(
  "/instructor",
  authMiddleware.validateUser,
  dashboardController.dashboardInstructor
);

export default dashboardRouter;
