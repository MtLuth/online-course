import courseServices from "../services/courseServices.js";
import catchAsync from "../utils/catchAsync.js";
import { courseValidationSchema } from "../validator/validationSchema.js";

class CourseController {
  createCourse = catchAsync(async (req, res, next) => {
    try {
      const uid = req.uid;
      const courseData = await courseValidationSchema.validate(req.body, {
        abortEarly: false, // Trả về tất cả các lỗi
      });

      const result = await courseServices.createCourse(uid, courseData);
      res.status(200).json({
        status: "Successfully",
        message: result,
      });
    } catch (error) {
      console.error(error); // In ra lỗi chi tiết
      next(error); // Chuyển lỗi cho middleware xử lý lỗi
    }
  });
}

export default new CourseController();
