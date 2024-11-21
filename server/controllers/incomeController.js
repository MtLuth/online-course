import incomeService from "../services/incomeService.js";
import catchAsync from "../utils/catchAsync.js";

class IncomeController {
  getAllIncomes = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const results = await incomeService.getAllIncome(uid);
    req.results = results;
    next();
  });

  getIncomeById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const income = await incomeService.getIncomeById(id);
    res.status(200).json({
      status: "Successfully",
      message: income,
    });
  });
}

export default new IncomeController();
