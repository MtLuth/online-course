import cartRepo from "../repository/cartRepo.js";
import courseRepo from "../repository/courseRepo.js";
import AppError from "../utils/appError.js";

class CartService {
  async addCourse(uid, courseId) {
    try {
      const course = await courseRepo.getCourseById(courseId);
      console.log(course);
      let total;
      if (course) {
        total = await cartRepo.addCourse(uid, course);
      }
      return {
        notify: "Thêm khóa học thành công!",
        total: total,
      };
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async getAllCourseInCart(uid) {
    try {
      const results = await cartRepo.getAllCourseInCart(uid);
      return results;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async removeCourse(uid, courseId) {
    try {
      const message = await cartRepo.removeCourse(uid, courseId);
      return message;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new CartService();
