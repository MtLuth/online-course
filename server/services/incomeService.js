import incomeRepo from "../repository/incomeRepo.js";
import AppError from "../utils/appError.js";

class IncomeService {
  async getAllIncome(uid, statusFilter) {
    try {
      const results = await incomeRepo.getAllIncome(uid);
      return results;
    } catch (error) {
      throw new AppError(`Lỗi khi lấy thông tin thu nhập: ${error}`);
    }
  }

  async getIncomeById(id) {
    try {
      const income = await incomeRepo.getIncomeById(id);
      return {
        course: income.course.title,
        price: income.course.salePrice,
        date: income.date._seconds * 1000,
        orderCode: income.orderCode,
        status: income.status,
        amount: income.amount,
      };
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new IncomeService();
