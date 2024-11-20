import { WithdrawStatus } from "../repository/withdrawRequestRepo.js";
import withdrawService from "../services/withdrawService.js";
import catchAsync from "../utils/catchAsync.js";
import { withdrawRequestSchema } from "../validator/validationSchema.js";
import yup, { object } from "yup";

class WithdrawController {
  createRequest = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const bankSchema = await withdrawRequestSchema.validate(req.body, {
      abortEarly: true,
    });
    const message = await withdrawService.createWithdrawRequest(
      uid,
      bankSchema.amount,
      bankSchema.bankName,
      bankSchema.bankNumber
    );
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  adminGetAllRequest = catchAsync(async (req, res, next) => {
    const statusKey = Object.keys(WithdrawStatus);
    const status = await yup
      .string()
      .oneOf(statusKey)
      .validate(req.query.status);
    const searchParam = req.query.searchParam;
    const results = await withdrawService.adminGetAllWithdrawRequest(
      status,
      searchParam
    );
    req.results = results;
    next();
  });
}

export default new WithdrawController();
