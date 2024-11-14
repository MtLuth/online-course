import purchaseServices from "../services/purchaseServices.js";
import catchAsync from "../utils/catchAsync.js";
import { buyCoursesSchema } from "../validator/validationSchema.js";

class PurchaseController {
  purchaseCourse = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courses = await buyCoursesSchema.validate(req.body.courses);
    const message = await purchaseServices.purchase(uid, courses);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  getAllHistory = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const results = await purchaseServices.getAllPurchases(uid);
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });
}

export default new PurchaseController();
