import bankService from "../services/bankService.js";
import catchAsync from "../utils/catchAsync.js";

class BankController {
  getAllBanks = catchAsync(async (req, res, next) => {
    const searchParam = req.query.searchParam;
    const results = await bankService.getAllBank(searchParam);
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });
}

export default new BankController();
