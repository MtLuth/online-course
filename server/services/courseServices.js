import Instructor from "../model/instructorModel.js";
import courseRepo from "../repository/courseRepo.js";
import Course from "../repository/courseRepo.js";
import myLearningsRepo from "../repository/myLearningsRepo.js";
import AppError from "../utils/appError.js";

class CourseService {
  async createCourse(uid, courseData) {
    try {
      const modelInstrutor = new Instructor();
      const instructor = await modelInstrutor.getById(uid);
      const result = await courseRepo.createCourse(instructor, courseData);
      return result;
    } catch (error) {
      console.log(error);
      throw new AppError(error, 500);
    }
  }

  async getAllCourseOfInstructor(uid, status, searchParam, category) {
    try {
      const results = await courseRepo.getCourseOfInstructor(
        uid,
        status,
        searchParam,
        category
      );
      return results;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async getCourseById(id) {
    try {
      const result = await courseRepo.getCourseById(id);
      return result;
    } catch (error) {
      throw new AppError("Khóa học không tồn tại!", 500);
    }
  }

  async updateCourseStatus(id, status) {
    try {
      const message = await courseRepo.updateStatusCourse(id, status);
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
      const message = await courseRepo.updateCourse(id, newValue);
      return message;
    } catch (error) {
      throw new AppError("Bạn không thể cập nhật khóa học này!", 500);
    }
  }

  async getAllCourse(uid, searchParam, orderByPrice, category) {
    try {
      let results = await courseRepo.getAllCourse(searchParam, category, uid);
      if (orderByPrice && orderByPrice !== "") {
        results = results.sort((a, b) => {
          if (orderByPrice === "asc") {
            return a.salePrice - b.salePrice;
          } else if (orderByPrice === "desc") {
            return b.salePrice - a.salePrice;
          }
          return 0;
        });
      }
      return results;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }

  async studentGetCourseById(uid, courseId) {
    try {
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

  async studentRatingCourse(courseId, ratingInformation) {
    try {
      const uid = ratingInformation.uid;
      const isValid = await myLearningsRepo.checkIsValidStudent(uid, courseId);
      if (!isValid) {
        throw new AppError("Bạn không có quyền đánh giá khóa học!");
      }
      await courseRepo.studentRating(courseId, ratingInformation);
      return "Cảm ơn bạn vì đã đánh giá khóa học!";
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        throw new AppError("Không tìm thấy người dùng!", 400);
      }
      throw new AppError(error, 500);
    }
  }
}

export default new CourseService();
