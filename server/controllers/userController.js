import userServices from "../services/userServices.js";
import catchAsync from "../utils/catchAsync.js";

class UserController {
  getProfile = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const profile = await userServices.getProfileById(uid);
    res.status(200).json({
      status: "Successfully",
      message: profile,
    });
  });
}

export default new UserController();
