import courseRepo from "../repository/courseRepo.js";
import purchaseHistoryRepo, {
  PurchaseStatus,
} from "../repository/purchaseHistoryRepo.js";
import AppError from "../utils/appError.js";

class PurchaseService {
  async purchase(uid, products) {
    try {
      let bill;
      let allProducts = [];
      let total = 0;
      for (const id of products) {
        const course = await courseRepo.getCourseById(id);
        if (course.isPublished) {
          allProducts.push({
            courseId: course.id,
            title: course.title,
            price: course.price,
            description: course.description,
            thumbnail: course.thumbnail,
            level: course.level,
          });
          total += course.price;
        } else {
          throw new AppError(`Khóa học ${course.title} hiện đã ngưng bán!`);
        }
      }
      bill = {
        sku: allProducts,
        total: total,
      };
      const code = await purchaseHistoryRepo.createPurchase(
        uid,
        bill,
        PurchaseStatus.pending
      );

      return { code, bill };
    } catch (error) {
      throw new AppError(`Lỗi khi tạo đơn hàng ${error}`, 500);
    }
  }

  async getAllPurchases(uid) {
    try {
      const results = await purchaseHistoryRepo.getAllPurchases(uid);
      return results;
    } catch (error) {
      throw new AppError("Đã xảy ra lỗi khi tải lịch sử!", 500);
    }
  }
  async deletePurchase(code) {
    try {
      const message = await purchaseHistoryRepo.deletePurchase(code);
      return message;
    } catch (error) {
      throw new AppError(`Không thể xóa sản phẩm: ${error}`);
    }
  }

  async updateStatusPurchase(code, status) {
    try {
      const message = await this.updateStatusPurchase(code, status);
      return message;
    } catch (error) {
      throw new AppError(`Lỗi khi cập nhật trạng thái đơn hàng ${error}`, 400);
    }
  }

  async addCourseToMyLearning(uid, code) {
    try {
      const purchase = await purchaseHistoryRepo.getPurchaseByCode(uid, code);
      if (purchase === null) {
        throw new AppError(`Không tìm thấy lịch sử mua hàng ${code}`, 500);
      }
      return purchase;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new PurchaseService();
