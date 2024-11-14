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
}
export default new InstructorController();
