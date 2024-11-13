import firebaseAdmin from "../firebase/firebaseAdmin.js";

class Cart {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("cart");
  }
  async addCourse(uid, course) {
    const snapshot = await this.dbRef.doc(uid).get();
    const data = snapshot.data();
    let courses = data.courses;
    const id = course.id;

    console.log(course);

    courses[id] = {
      course: {
        title: course.title,
        instructor: course.instructor.fullName,
        level: course.level,
        price: course.price,
      },
      createdAt: Date.now(),
    };
    const totalCourse = Object.keys(courses).length;
    await this.dbRef.doc(uid).update({ courses: courses, total: totalCourse });
  }

  async getAllCourseInCart(uid) {
    const snapshot = await this.dbRef.doc(uid).get();
    const data = snapshot.data();
    const courses = data.courses;
    let results = [];
    const keys = Object.keys(courses);
    keys.forEach((key) => {
      results.push(courses[key]);
    });
    return {
      courses: courses,
      total: data.total,
    };
  }

  async removeCourse(uid, courseId) {
    const snapshot = await this.dbRef.doc(uid).get();
    const data = snapshot.data();
    let courses = data.courses;
    if (courses && courses[courseId]) {
      console.log("aaaa");
      delete courses[courseId];
    }
    const total = data.total - 1;
    await this.dbRef.doc(uid).update({ courses: { ...courses }, total: total });
    return "Đã xóa sản phẩm khỏi cửa hàng!";
  }
}

export default new Cart();
