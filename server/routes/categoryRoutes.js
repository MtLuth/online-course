import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import categoryController from "../controllers/categoryController.js";

const categoryRouter = e.Router();

categoryRouter
  .route("/")
  .post(
    authMiddleware.validateUser,
    authMiddleware.validateRoleAdmin,
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);

categoryRouter
  .route("/:id")
  .put(
    authMiddleware.validateUser,
    authMiddleware.validateRoleAdmin,
    categoryController.updateCategory
  )
  .delete(
    authMiddleware.validateUser,
    authMiddleware.validateRoleAdmin,
    categoryController.deleteCategoryById
  );

export default categoryRouter;
