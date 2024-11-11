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
}

export default new CourseService();
