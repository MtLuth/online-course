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

const videoFilter = (req, file, cb) => {
  if (file.mimetype === "video/mov" || file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    new Error("Invalid file type. Only MOV, MP4"), false;
  }
};

const storage = multer.memoryStorage();

const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
});

const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFilter,
});

export { uploadImage, uploadVideo };
