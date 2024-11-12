import courseServices from "../services/courseServices.js";
import catchAsync from "../utils/catchAsync.js";
import { courseValidationSchema } from "../validator/validationSchema.js";
import yup from "yup";

class CourseController {
  createCourse = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courseData = await courseValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    const result = await courseServices.createCourse(uid, courseData);
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });

  getAllCourseOfInstructor = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courseData = await courseServices.getAllCourseOfInstructor(uid);
    res.status(200).json({
      status: "Successfully",
      message: courseData,
    });
  });

  getCourseById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const courseData = await courseServices.getCourseById(id);
    res.status(200).json({
      status: "Successfully",
      message: courseData,
    });
  });

  updateCourseStatus = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const statusValidate = yup.boolean().required("status is required");
    const status = await statusValidate.validate(req.body.status);
    const message = await courseServices.updateCourseStatus(id, status);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });
}

export default new CourseController();
