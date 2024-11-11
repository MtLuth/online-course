import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";
class UploadService {
  async uploadImage(fileBuffer, fileName) {
    try {
      const storage = firebaseAdmin.storage().bucket();
      const file = storage.file(`${Date.now()}_${fileName}`);
      await file.save(fileBuffer, {
        public: true,
        metadata: {
          contentType: "image",
        },
      });
      return file.publicUrl();
    } catch (error) {
      console.log(error);
      throw new AppError(error, 500);
    }
  }
}

export default new UploadService();
