import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

const firestore = firebaseAdmin.firestore();

class Course {
  constructor() {
    this.courseCollection = firestore.collection("courses");
  }

  async createCourse(instructor, courseData) {
    try {
      const courseRef = await this.courseCollection.add({
        instructor: { ...instructor },
        ...courseData,
      });
      return courseRef.id;
    } catch (error) {
      throw new AppError(`Lỗi khi tạo khóa học: ${error}`, 500);
    }
  }
}

export default Course;
