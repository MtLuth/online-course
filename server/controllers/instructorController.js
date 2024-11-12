import instructorServices from "../services/instructorServices.js";
import catchAsync from "../utils/catchAsync.js";
import { paginationValidate } from "../validator/validationSchema.js";

class InstructorController {
  getAllInstructor = catchAsync(async (req, res, next) => {
    const status = req.query.status;
    const searchParam = req.query.searchParam;
    const pagination = await paginationValidate.validate(req.query);
    const results = await instructorServices.getAllInstructor(
      status,
      searchParam,
      pagination.limit,
      pagination.page
    );
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });
}
export default new InstructorController();
