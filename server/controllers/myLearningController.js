import myLearningsServices from "../services/myLearningsServices.js";
import catchAsync from "../utils/catchAsync.js";

class MyLearningController {
  getAllCourses = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const searchParam = req.query.searchParam;
    const resutls = await myLearningsServices.getAllCourses(uid, searchParam);
    res.status(200).json({
      status: "Successfully",
      message: resutls,
    });
  });
}

export default new MyLearningController();
