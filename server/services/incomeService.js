import Income, { IncomeStatus } from "../model/incomeModel";
import incomeRepo from "../repository/incomeRepo";
import AppError from "../utils/appError";

class IncomeService {
  async addIncome(uid, income) {
    try {
      const newIncome = new Income(
        income.amount,
        income.course,
        IncomeStatus.InProgress
      );
      await incomeRepo.addIncome(uid, newIncome);
    } catch (error) {
      throw new AppError(`Lỗi trong quá trình xử lý thu nhập: ${error}`);
    }
  }
}
