import uploadServices from "../services/uploadServices.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

class UploadController {
  uploadImage = catchAsync(async (req, res, next) => {
    const file = req.file;
    if (!file) {
      return next(new AppError("File không được để trống", 400));
    }

    const fileBuffer = file.buffer;
    const time = Date.now();
    const fileName = file.originalname;

    const result = await uploadServices.uploadImage(
      fileBuffer,
      `${time}_${fileName}`
    );
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });
}

export default new UploadController();
