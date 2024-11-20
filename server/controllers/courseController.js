import courseServices from "../services/courseServices.js";
import catchAsync from "../utils/catchAsync.js";
import {
  courseValidationSchema,
  ratingSchema,
} from "../validator/validationSchema.js";
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
    const isPublishedValidate = yup.boolean();
    const isPublished = await isPublishedValidate.validate(
      req.query.isPublished
    );
    const searchParam = req.query.searchParam;
    const category = req.query.category;
    const courseData = await courseServices.getAllCourseOfInstructor(
      uid,
      isPublished,
      searchParam,
      category
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
    const saleValidate = yup.number().min(0).max(1);
    const sale = await saleValidate.validate(req.body.sale);
    const message = await courseServices.updateCourse(id, {
      ...newValues,
      ...sale,
    });
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  getAllCourse = catchAsync(async (req, res, next) => {
    const searchParam = req.query.searchParam;
    const category = req.query.category;
    const uid = req.query.uid;
    const validateOrderbyPrice = yup.string().oneOf(["asc", "desc"]);
    const orderByPrice = await validateOrderbyPrice.validate(
      req.query.orderByPrice
    );
    const courseData = await courseServices.getAllCourse(
      uid,
      searchParam,
      orderByPrice,
      category
    );
    req.results = courseData;
    next();
  });

  studentGetCourseById = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courseId = req.params.courseId;
    const result = await courseServices.studentGetCourseById(uid, courseId);
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });

  studentRatingCourse = catchAsync(async (req, res, next) => {
    const courseId = req.params.courseId;
    const uid = req.uid;
    const ratingInformation = await ratingSchema.validate(req.body);
    const message = await courseServices.studentRatingCourse(courseId, {
      uid: uid,
      ...ratingInformation,
    });
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });

  studentEditRatingCourse = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const courseId = req.params.courseId;
    const schema = yup.object({
      score: yup.number().min(1).max(5),
      content: yup.string().min(10),
    });

    const { score, content } = await schema.validate(req.body, {
      abortEarly: false,
    });
    const message = await courseServices.studentEditRating(
      courseId,
      uid,
      score,
      content
    );
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });
}

export default new CourseController();
