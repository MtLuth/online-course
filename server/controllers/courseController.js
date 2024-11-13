import courseServices from "../services/courseServices.js";
import catchAsync from "../utils/catchAsync.js";
import { courseValidationSchema } from "../validator/validationSchema.js";
import yup from "yup";
import paginate from "express-paginate";

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
    const isPublishedValidate = yup.boolean();
    const isPublished = await isPublishedValidate.validate(
      req.query.isPublished
    );
    const searchParam = req.query.searchParam;
    const courseData = await courseServices.getAllCourseOfInstructor(
      uid,
      isPublished,
      searchParam
    );
    req.results = courseData;
    next();
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

  updateCourse = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const newValues = { ...req.body };
    const message = await courseServices.updateCourse(id, newValues);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });
}

export default new CourseController();
