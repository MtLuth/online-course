import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";
class UploadService {
  async uploadImage(fileBuffer, fileName) {
    try {
      const storage = firebaseAdmin.storage().bucket();
      const file = storage.file(`images/${Date.now()}_${fileName}`);
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

  uploadVideos(uid, files) {
    const storage = firebaseAdmin.storage().bucket();
    var filesUrl = [];
    files.map(async (file) => {
      try {
        const ref = storage.file(`videos/${uid}/${file.originalname}`);
        ref.save(file.buffer, {
          public: true,
          metadata: {
            contentType: "video",
          },
        });
        filesUrl.push(ref.publicUrl());
      } catch (error) {
        throw new AppError(error, 500);
      }
    });
    return filesUrl;
  }

  async uploadResources(uid, files) {
    const storage = firebaseAdmin.storage().bucket();
    const filesUrl = [];

    for (const file of files) {
      try {
        const ref = storage.file(`resources/${uid}/${file.originalname}`);

        await ref.save(file.buffer, {
          public: true,
          metadata: {
            contentType: file.mimetype,
          },
        });

        filesUrl.push(ref.publicUrl());
      } catch (error) {
        throw new AppError(error.message || "Failed to upload file.", 500);
      }
    }

    return filesUrl;
  }
}

export default new UploadService();
