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
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        avt: user.avt,
      },
    });
  });
  updateProfile = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const newData = req.body;
    const message = await userServices.updateProfileById(uid, newData);
    res.status(200).json({
      status: "Successfully",
      message: message,
    });
  });
}

export default new UserController();
