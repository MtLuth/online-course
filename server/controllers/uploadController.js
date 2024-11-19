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

  uploadVideos = catchAsync(async (req, res, next) => {
    const files = req.files;
    const uid = req.uid;
    if (!files) {
      return next(new AppError("Files không được để trống", 400));
    }

    const result = await uploadServices.uploadVideos(uid, files);
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });

  uploadResources = catchAsync(async (req, res, next) => {
    const files = req.files;
    const uid = req.uid;
    if (!files) {
      return next(new AppError("Files không được để trống", 400));
    }

    const result = await uploadServices.uploadResources(uid, files);
    res.status(200).json({
      status: "Successfully",
      message: result,
    });
  });
}

export default new UploadController();
