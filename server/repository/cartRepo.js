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

  async getAllCourseOfCart(uid) {}
}

export default new Cart();
