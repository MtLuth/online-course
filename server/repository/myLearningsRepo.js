import firebaseAdmin from "../firebase/firebaseAdmin.js";

class MyLearning {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("myLearnings");
  }

  async createMyLearnings(uid, courses) {
    const doc = await this.dbRef.doc(uid).get();
    let allCourses = [];
    if (doc.exists) {
      const data = doc.data();
      allCourses = data.courses;
    }
    allCourses = allCourses.concat(courses);
    const total = allCourses.length;

    await this.dbRef.doc(uid).set({
      courses: allCourses,
      total: total,
    });
    return "Thêm khóa học mới thành cônng";
  }

  async checkIsValidStudent(uid, courseId) {
    const snapshot = await this.dbRef.doc(uid).get();
    console.log(uid, courseId);
    if (!snapshot.exists) {
      return false;
    }
    const data = snapshot.data();
    const courses = data.courses;
    for (let course of courses) {
      if (course.courseId === courseId) {
        return true;
      }
    }
    return false;
  }
}

export default new MyLearning();