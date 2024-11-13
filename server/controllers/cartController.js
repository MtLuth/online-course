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
}

export default new CartController();
