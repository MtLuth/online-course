import Course from "../repository/courseRepo.js";
import myLearningsRepo from "../repository/myLearningsRepo.js";
import purchaseHistoryRepo from "../repository/purchaseHistoryRepo.js";
import AppError from "../utils/appError.js";

class PurchaseService {
  async purchase(uid, products) {
    try {
      let bill;
      let allProducts = [];
      let myLearnings = [];
      let total = 0;
      const courseRepo = new Course();
      for (const id of products) {
        const course = await courseRepo.getCourseById(id);
        if (course.isPublished) {
          allProducts.push({
            courseId: course.id,
            title: course.title,
            price: course.price,
          });
          myLearnings.push({
            courseId: course.id,
            title: course.title,
            thumbnail: course.thumbnail,
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
      const [addMyLearnings, message] = await Promise.all([
        myLearningsRepo.createMyLearnings(uid, myLearnings),
        purchaseHistoryRepo.createPurchase(uid, bill),
      ]);

      return { addMyLearnings, message };
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
}

export default new PurchaseService();
