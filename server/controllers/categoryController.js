import categoryServices from "../services/categoryServices.js";
import catchAsync from "../utils/catchAsync.js";
import { categorySchema } from "../validator/validationSchema.js";

class CategoryController {
  createCategory = catchAsync(async (req, res, next) => {
    const category = await categorySchema.validate(req.body, {
      abortEarly: true,
    });
    const message = await categoryServices.createCate(category);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  getAllCategories = catchAsync(async (req, res, next) => {
    const results = await categoryServices.getAllCategories();
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });
}

export default new CategoryController();
