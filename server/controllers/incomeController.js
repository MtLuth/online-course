import incomeService from "../services/incomeService.js";
import catchAsync from "../utils/catchAsync.js";

class IncomeController {
  getAllIncomes = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const results = await incomeService.getAllIncome(uid);
    req.results = results;
    next();
  });
}

export default new IncomeController();
