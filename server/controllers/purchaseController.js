import purchaseServices from "../services/purchaseServices.js";
import catchAsync from "../utils/catchAsync.js";
import { buyCoursesSchema } from "../validator/validationSchema.js";

class PurchaseController {
  purchaseCourse = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courses = await buyCoursesSchema.validate(req.body.courses);
    const results = await purchaseServices.purchase(uid, courses);
    req.bill = {
      code: results.code,
      ...results.bill,
    };
    next();
  });

  getAllHistory = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const results = await purchaseServices.getAllPurchases(uid);
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });

  deletePurchase = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const code = req.query.orderCode;
    const message = await purchaseServices.deletePurchase(uid, code);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  successPurchase = catchAsync(async (req, res, next) => {
    // const uid = req.uid;
    // const code = req.params.code;
    // const result = await purchaseServices.addCourseToMyLearning(uid, code);
    res.status(200).json({
      status: 200,
      message: req.body,
    });
  });
}

export default new PurchaseController();
