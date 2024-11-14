import categoryRepo from "../repository/categoryRepo.js";
import AppError from "../utils/appError.js";

class CategoryService {
  async createCate(data) {
    try {
      const message = await categoryRepo.createCategory(data);
      return message;
    } catch (error) {
      throw new AppError(`Không thể tạo category: ${error}`, 500);
    }
  }

  async getAllCategories() {
    try {
      const results = await categoryRepo.getAllCategory();
      return results;
    } catch (error) {
      throw new AppError(`Lỗi khi lấy categories: ${error}`, 500);
    }
  }
}

export default new CategoryService();
