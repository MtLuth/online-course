import multer, { memoryStorage } from "multer";

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, and JPG files are allowed."
      ),
      false
    );
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
});

export default upload;
