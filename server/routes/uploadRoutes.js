import e from "express";
import upload from "../middleware/multerMiddleware.js";
import uploadController from "../controllers/uploadController.js";

const uploadRouter = e.Router();

uploadRouter.post(
  "/image",
  upload.single("file"),
  uploadController.uploadImage
);

export default uploadRouter;
