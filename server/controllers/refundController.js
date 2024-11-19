import { RefundStatus } from "../model/refundModel.js";
import refundRepo from "../repository/refundRepo.js";
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
    const searchParam = req.query.searchParam;
    const filterStatus = await statusValidate.validate(req.query.status);
    const results = await refundService.getAllRefundsByAdmin(
      filterStatus,
      searchParam
    );
    req.results = results;
    next();
  });

  viewDetailRefund = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const results = await refundService.viewDetailRefund(id);
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });

  updateRefundStatus = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const statusKeys = Object.keys(RefundStatus);
    const statusValidate = yup
      .string()
      .label("status")
      .required()
      .oneOf(statusKeys);
    const status = await statusValidate.validate(req.body.status);
    let reason;
    if (status === "Reject") {
      const reasonValidate = yup.string().label("reason").required();
      reason = await reasonValidate.validate(req.body.reason);
    }
    const message = await refundService.updateStatusRefund(id, status, reason);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  getAllRefundsOfStudent = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const statusKeys = Object.keys(RefundStatus);
    const statusValidate = yup.string().oneOf(statusKeys);
    const filterStatus = await statusValidate.validate(req.query.status);
    const results = await refundRepo.getAllRefundOfStudent(uid, filterStatus);
    req.results = results;
    next();
  });
}

export default new RefundController();
