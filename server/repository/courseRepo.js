import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";
import myLearningsRepo from "./myLearningsRepo.js";
import userRepo from "./userRepo.js";

const firestore = firebaseAdmin.firestore();

class CourseRepo {
  constructor() {
    this.dbRef = firestore.collection("courses");
  }

  async createCourse(instructor, courseData) {
    const courseRef = await this.dbRef.add({
      instructor: { ...instructor },
      ...courseData,
      sale: 0,
      enrollment: 0,
      reviews: [],
      rating: [],
    });
    return courseRef.id;
  }

  async getCourseOfInstructor(uid, status, searchParam, category) {
    const results = [];
    let query = this.dbRef.where("instructor.uid", "==", uid);
    if (status && status !== "") {
      query = query.where("isPublished", "==", status);
    }
    const querySnapshot = await query.get();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (searchParam && searchParam !== "") {
        searchParam = searchParam.toLowerCase();
      }
      const matchTitle =
        data.title && data.title.toLowerCase().includes(searchParam);
      const matchLevel =
        data.level && data.level.toLowerCase().includes(searchParam);
      const matchDescription =
        data.description &&
        data.description.toLowerCase().includes(searchParam);
      const matchCategory =
        (data.category && data.category === category) || !category;
      if (
        (matchTitle || matchLevel || matchDescription || !searchParam) &&
        matchCategory
      ) {
        results.push({
          id: doc.id,
          title: data.title,
          price: data.price,
          description: data.description,
          category: data.category,
          level: data.level,
          isPublished: data.isPublished,
          thumbnail: data.thumbnail,
          sale: data.sale,
          reviews: data.reviews,
          ratings: data.rating,
          enrollment: data.enrollment,
        });
      }
    });
    return results;
  }

  async getCourseById(id) {
    const doc = await this.dbRef.doc(id).get();
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
      isPublished: data.isPublished,
      enrollment: data.enrollment,
      sale: data.sale,
      salePrice: (1 - data.sale) * data.price,
      rating: data.rating,
    };
  }

  async updateStatusCourse(id, status) {
    const doc = await this.dbRef.doc(id);
    await doc.update({ isPublished: status, updatedAt: new Date() });
    return "Đã cập trạng thái khóa học!";
  }

  async updateCourse(id, newValues) {
    const doc = await this.dbRef.doc(id).get();
    const course = {
      ...doc.data(),
    };
    Object.entries(newValues).forEach(([key, value]) => {
      if (!course.hasOwnProperty(key)) {
        delete newValues[key];
      }
    });
    await this.dbRef.doc(id).update({ ...newValues, updatedAt: new Date() });
    return "Cập nhật khóa học thành công!";
  }

  async getAllCourse(searchParam, orderByPrice, category, uid) {
    const results = [];
    let query = this.dbRef.where("isPublished", "==", true);
    if (orderByPrice && orderByPrice !== "") {
      query = query.orderBy("price", orderByPrice);
    }
    const querySnapshot = await query.get();
    const promises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      let salePrice = data.price;
      if (data.sale) {
        salePrice = (1 - data.sale) * data.price;
      }

      if (searchParam && searchParam !== "") {
        searchParam = searchParam.toLowerCase();
      }

      let isValid = false;
      if (uid) {
        isValid = await myLearningsRepo.checkIsValidStudent(uid, doc.id);
      }

      const matchTitle =
        data.title && data.title.toLowerCase().includes(searchParam);
      const matchLevel =
        data.level && data.level.toLowerCase().includes(searchParam);
      const matchDescription =
        data.description &&
        data.description.toLowerCase().includes(searchParam);
      const matchCategory =
        (data.category && data.category === category) ||
        category === "" ||
        !category;

      let score = 0;
      const rating = data.rating;
      if (rating.length > 0) {
        const totalScore = rating.reduce((sum, item) => sum + item.score, 0);
        score = totalScore / rating.length;
      }

      if (
        (matchTitle || matchLevel || matchDescription || !searchParam) &&
        matchCategory
      ) {
        return {
          id: doc.id,
          title: data.title,
          price: data.price,
          description: data.description,
          category: data.category,
          level: data.level,
          isPublished: data.isPublished,
          thumbnail: data.thumbnail,
          isMyLearning: isValid,
          salePrice: salePrice,
          sale: data.sale,
          rating: data.rating,
          enrollment: data.enrollment,
          ratingScore: score,
        };
      }

      return results;
    });
    return await Promise.all(promises);
  }

  async increaseEnrollment(uid) {
    const doc = await this.dbRef.doc(uid).get();
    const data = doc.data();
    let enrollment = data.enrollment;
    enrollment = enrollment + 1;
    await this.dbRef.doc(uid).update({
      enrollment: enrollment,
    });
  }

  async studentRating(courseId, ratingInformation) {
    const doc = await this.dbRef.doc(courseId).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    const uid = ratingInformation.uid;
    const score = ratingInformation.score;
    const content = ratingInformation.content;
    const firebaseAuth = firebaseAdmin.auth();
    const userCredential = await firebaseAuth.getUser(uid);
    let rating = data.rating;

    const hasRated = rating.some(
      (item) => item.user.uid === ratingInformation.uid
    );
    if (hasRated) {
      throw new AppError("Bạn đã đánh giá khóa học này rồi!");
    }

    rating.push({
      user: {
        uid: uid,
        fullName: userCredential.displayName,
        avt: userCredential.photoURL,
        email: userCredential.email,
      },
      score: score,
      content: content,
    });
    await this.dbRef.doc(courseId).update({
      rating: rating,
    });
  }
}
export default new CourseRepo();
