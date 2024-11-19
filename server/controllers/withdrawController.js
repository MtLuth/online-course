import withdrawService from "../services/withdrawService.js";
import catchAsync from "../utils/catchAsync.js";
import { withdrawRequestSchema } from "../validator/validationSchema.js";

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
}

export default new WithdrawController();
