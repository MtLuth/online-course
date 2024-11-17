import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import categoryController from "../controllers/categoryController.js";
import pagination from "../middleware/paginateMiddleware.js";

const categoryRouter = e.Router();

categoryRouter
  .route("/")
  .post(
    authMiddleware.validateUser,
    authMiddleware.validateRoleAdmin,
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories, pagination);

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
