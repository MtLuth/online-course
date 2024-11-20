import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

class IncomeRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("incomes");
  }

  async addIncome(uid, income) {
    const docRef = await this.dbRef.add({
      uid: uid,
      ...income,
      refundStatus: false,
    });
    const newId = docRef.id;
    return newId;
  }

  async updateStatusIncome(id, status) {
    try {
      await this.dbRef.doc(id).update({
        status: status,
      });
    } catch (error) {
      throw new AppError(`Lỗi trong quá trình tạo thu nhập: ${error}`);
    }
  }

  async getAllIncome(uid) {
    let query = this.dbRef;
    const snapshot = await query.get();
    const incomes = snapshot.docs
      .filter((doc) => doc.data().uid === uid)
      .map((doc) => {
        const data = doc.data();
        const course = data.course;
        return {
          uid: data.uid,
          course: {
            courseId: course.courseId,
            title: course.title,
            price: course.salePrice,
          },
          date: data.date._seconds,
          orderCode: data.orderCode,
          status: data.status,
          amount: data.amount,
        };
      });
    return incomes;
  }
}

export default new IncomeRepo();
