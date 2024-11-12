import e from "express";
import { uploadImage, uploadVideo } from "../middleware/multerMiddleware.js";
import uploadController from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const uploadRouter = e.Router();

uploadRouter.post(
  "/image",
  uploadImage.single("file"),
  uploadController.uploadImage
);

uploadRouter.post(
  "/videos",
  authMiddleware.validateUser,
  uploadVideo.any("files"),
  uploadController.uploadVideos
);

export default uploadRouter;
