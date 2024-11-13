import cartRepo from "../repository/cartRepo.js";
import Course from "../repository/courseRepo.js";
import AppError from "../utils/appError.js";

class CartService {
  async addCourse(uid, courseId) {
    try {
      const courseRepo = new Course();
      const course = await courseRepo.getCourseById(courseId);
      if (course) {
        await cartRepo.addCourse(uid, course);
      }
      return "Đã thêm khóa học vào giỏ hàng!";
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new CartService();
