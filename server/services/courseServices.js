import Instructor from "../model/instructorModel.js";
import Course from "../repository/courseRepo.js";
import myLearningsRepo from "../repository/myLearningsRepo.js";
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

  async getAllCourseOfInstructor(uid, status, searchParam) {
    try {
      const courseModel = new Course();
      const results = await courseModel.getCourseOfInstructor(
        uid,
        status,
        searchParam
      );
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

  async getAllCourse(searchParam, orderByPrice) {
    try {
      const courseModel = new Course();
      const results = await courseModel.getAllCourse(searchParam, orderByPrice);
      return results;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async studentGetCourseById(uid, courseId) {
    try {
      const courseRepo = new Course();
      const course = await courseRepo.getCourseById(courseId);
      let courseContent = course.content;
      const isValidStudent = await myLearningsRepo.checkIsValidStudent(
        uid,
        courseId
      );
      delete course["content"];
      let customContent = [];
      if (!isValidStudent) {
        for (let content of courseContent) {
          const customLectures = this.customLectures(content.lectures);
          customContent.push({
            sectionTitle: content.sectionTitle,
            lectures: customLectures,
          });
        }
        courseContent = customContent;
      }
      return {
        course: { ...course, content: courseContent },
        isValidStudent,
      };
    } catch (error) {
      console.log(error);
      throw new AppError("Lỗi khi lấy thông tin khóa học!", 500);
    }
  }

  customLectures(lectures) {
    let results = [];
    for (let lecture of lectures) {
      results.push({ title: lecture.title });
    }
    return results;
  }
}

export default new CourseService();
