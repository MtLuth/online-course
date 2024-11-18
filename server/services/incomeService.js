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
}

export default new IncomeService();
