import { title } from "process";
import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

const firestore = firebaseAdmin.firestore();

class Course {
  constructor() {
    this.courseCollection = firestore.collection("courses");
  }

  async createCourse(instructor, courseData) {
    const courseRef = await this.courseCollection.add({
      instructor: { ...instructor },
      ...courseData,
    });
    return courseRef.id;
  }

  async getCourseOfInstructor(uid) {
    const results = [];
    const query = this.courseCollection.where("instructor.uid", "==", uid);
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        level: data.level,
        isPublished: data.isPublished,
      });
    });
    return results;
  }

  async getCourseById(id) {
    const doc = await this.courseCollection.doc(id).get();
    const data = doc.data();
    return {
      id: doc.id,
      instructor: {
        fullName: data.instructor.fullName,
        uid: data.instructor.uid,
      },
      content: data.content,
      whatYouWillLearn: data.whatYouWillLearn,
      requirements: data.requirements,
      updatedAt: data.updatedAt._seconds,
      thumbnail: data.thumbnail,
      level: data.level,
      language: data.language,
      price: data.price,
      category: data.category,
      description: data.description,
      title: data.title,
    };
  }

  async updateStatusCourse(id, status) {
    const doc = await this.courseCollection.doc(id);
    await doc.update({ isPublished: status, updatedAt: new Date() });
    return "Đã cập trạng thái khóa học!";
  }

  async updateCourse(id, newValues) {
    const doc = await this.courseCollection.doc(id).get();
    const course = {
      ...doc.data(),
    };
    Object.entries(newValues).forEach(([key, value]) => {
      if (!course[key]) {
        delete newValues[key];
      }
    });
    await this.courseCollection
      .doc(id)
      .update({ ...newValues, updatedAt: new Date() });
    return "Cập nhật khóa học thành công!";
  }
}
export default Course;
