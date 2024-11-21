import cartServices from "../services/cartServices.js";
import catchAsync from "../utils/catchAsync.js";
import yup from "yup";

class CartController {
  addCourse = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courseIdValidate = yup.string().required("Mã khóa học là bắt buộc!");
    const courseId = await courseIdValidate.validate(req.params.courseId);
    const result = await cartServices.addCourse(uid, courseId);
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });

  getAllCoursesInCart = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const results = await cartServices.getAllCourseInCart(uid);
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });

  deleteCourse = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courseId = req.params.courseId;
    const message = await cartServices.removeCourse(uid, courseId);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });
}

export default new CartController();
