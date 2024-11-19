import { RefundStatus } from "../model/refundModel.js";
import refundService from "../services/refundService.js";
import catchAsync from "../utils/catchAsync.js";
import { refundSchema } from "../validator/validationSchema.js";
import yup from "yup";

class RefundController {
  createRefund = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const refundInformation = await refundSchema.validate(req.body, {
      abortEarly: true,
    });
    const message = await refundService.createRefund(uid, refundInformation);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  getAllRefundsByAdmin = catchAsync(async (req, res, next) => {
    let statusKeys = Object.keys(RefundStatus);
    const statusValidate = yup.string().oneOf(statusKeys);
    const filterStatus = await statusValidate.validate(req.query.status);
    const results = await refundService.getAllRefundsByAdmin(filterStatus);
    req.results = results;
    next();
  });
}

export default new RefundController();
