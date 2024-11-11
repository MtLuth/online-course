import instructorServices from "../services/instructorServices.js";
import catchAsync from "../utils/catchAsync.js";

class InstructorController {
  getAllInstructor = catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "status"];
    excludedFields.map((e) => delete queryObj[e]);
    const status = req.query.status;
    const searchParams = { ...queryObj };
    const results = await instructorServices.getAllInstructor(
      status,
      searchParams
    );
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });
}
export default new InstructorController();
