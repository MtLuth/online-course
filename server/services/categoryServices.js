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

  async deleteCategoryById(id) {
    try {
      const message = await categoryRepo.deleteCategoryById(id);
      return message;
    } catch (error) {
      throw new AppError(`Không thể xóa category trên`);
    }
  }

  async updateCategory(id, newData) {
    try {
      if (!newData || Object.keys(newData).length === 0) {
        throw new Error("Không có dữ liệu để cập nhật");
      }
      const message = await categoryRepo.updateCategory(id, newData);
      return message;
    } catch (error) {
      throw new AppError(`Không thể cập nhật category: ${error}`, 500);
    }
  }
}

export default new CategoryService();
