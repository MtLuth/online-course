import firebaseAdmin from "../firebase/firebaseAdmin.js";

class Cart {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("cart");
  }
  async addCourse(uid, course) {
    const snapshot = await this.dbRef.doc(uid).get();
    const data = snapshot.data();
    let courses = data.courses || {};
    const id = course.id;

    courses[id] = {
      course: {
        title: course.title,
        instructor: course.instructor.fullName,
        level: course.level,
        price: course.price,
        salePrice: Math.round((1 - course.sale) * course.price),
        thumbnail: course.thumbnail,
      },
      createdAt: Date.now(),
    };
    const totalCourse = Object.keys(courses).length;
    await this.dbRef.doc(uid).update({ courses: courses, total: totalCourse });
    return totalCourse;
  }

  async getAllCourseInCart(uid) {
    const snapshot = await this.dbRef.doc(uid).get();
    const data = snapshot.exists ? snapshot.data() : {};
    const courses = data.courses ? data.courses : [];
    let results = [];
    const keys = Object.keys(courses);
    keys.forEach((key) => {
      let map = {};
      map[key] = courses[key];
      results.push(map);
    });
    results.sort((a, b) => {
      const dateA = a.createdAt;
      const dateB = b.createdAt;
      return dateB - dateA;
    });

    return {
      courses: results,
      total: data.total,
    };
  }

  async removeCourse(uid, courseId) {
    const snapshot = await this.dbRef.doc(uid).get();
    const data = snapshot.data();
    let courses = data.courses;
    if (courses && courses[courseId]) {
      console.log("hiiii");
      delete courses[courseId];
    }
    const total = data.total - 1;
    await this.dbRef.doc(uid).update({ courses: { ...courses }, total: total });
    console.log("Đã xóa sản phẩm khỏi cửa hàng");
    return "Đã xóa sản phẩm khỏi cửa hàng!";
  }

  async removeCourses(uid, courses) {
    const snapshot = await this.dbRef.doc(uid).get();
    if (!snapshot.exists) {
      return;
    }
    const coursesId = courses.map((course) => course.courseId);
    const newCourses = snapshot.data().courses;
    coursesId.forEach((id) => delete newCourses[id]);
    await this.dbRef.doc(uid).update({
      courses: newCourses,
      total: snapshot.data().total - coursesId.length,
    });
  }
}

export default new Cart();
