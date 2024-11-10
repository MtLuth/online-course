import userServices from "../services/userServices.js";
import catchAsync from "../utils/catchAsync.js";

class UserController {
  getProfile = catchAsync(async (req, res, next) => {
    const uid = req.params.uid;
    const user = await userServices.getProfileById(uid);
    res.status(200).json({
      status: "Successfully",
      message: {
        email: user.email,
      },
    });
  });
}

export default new UserController();
