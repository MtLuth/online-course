import dashboardServices from "../services/dashboardServices.js";
import catchAsync from "../utils/catchAsync.js";

class DashboardController {
  dashboardAdmin = catchAsync(async (req, res, next) => {
    const results = await dashboardServices.dashBoardAdmin();
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });

  dashboardInstructor = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const results = await dashboardServices.dashboardInstructor(uid);
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });
}

export default new DashboardController();
