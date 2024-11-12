import Course from "../model/courseModel.js";
import Instructor from "../model/instructorModel.js";
import AppError from "../utils/appError.js";

class CourseService {
  async createCourse(uid, courseData) {
    try {
      const modelInstrutor = new Instructor();
      const instructor = await modelInstrutor.getById(uid);
      const courseModel = new Course();
      const result = await courseModel.createCourse(instructor, courseData);
      return result;
    } catch (error) {
      console.log(error);
      throw new AppError(error, 500);
    }
  }

  async getAllCourseOfInstructor(uid) {
    try {
      const courseModel = new Course();
      const results = await courseModel.getCourseOfInstructor(uid);
      return results;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async getCourseById(id) {
    try {
      const courseModel = new Course();
      const result = await courseModel.getCourseById(id);
      return result;
    } catch (error) {
      throw new AppError("Khóa học không tồn tại!", 500);
    }
  }

  async updateCourseStatus(id, status) {
    try {
      const courseModel = new Course();
      const message = await courseModel.updateStatusCourse(id, status);
      return message;
    } catch (error) {
      throw new AppError(
        "Bạn không thể cập nhật trạng thái cho khóa học này!",
        500
      );
    }
  }

  async updateCourse(id, newValue) {
    try {
      const courseModel = new Course();
      const message = await courseModel.updateCourse(id, newValue);
      return message;
    } catch (error) {
      throw new AppError("Bạn không thể cập nhật khóa học này!", 500);
    }
  }
}

export default new CourseService();
