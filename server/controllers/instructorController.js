import courseServices from "../services/courseServices.js";
import instructorServices from "../services/instructorServices.js";
import catchAsync from "../utils/catchAsync.js";

class InstructorController {
  getAllInstructor = catchAsync(async (req, res, next) => {
    const status = req.query.status;
    const searchParam = req.query.searchParam;
    const results = await instructorServices.getAllInstructor(
      status,
      searchParam
    );
    req.results = results;
    next();
  });

  studentViewInstructorPage = catchAsync(async (req, res, next) => {
    const uid = req.params.uid;
    const searchParam = req.query.searchParam;
    const instructor = await instructorServices.studentViewInstructor(uid);
    const courseData = await courseServices.getAllCourseOfInstructor(
      uid,
      true,
      searchParam,
      undefined
    );
    console.log(courseData);
    res.status(200).json({
      status: "Successfully",
      message: {
        instructor: { ...instructor },
        courses: courseData,
      },
    });
  });
}
export default new InstructorController();
