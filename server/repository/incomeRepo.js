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

  async getIncomeById(id) {
    const doc = await this.dbRef.doc(id).get();
    if (!doc.exists) {
      throw new AppError(`Không tìm thấy thông tin!`, 500);
    }
    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  async updateRefundStatus(orderCode, refundStatus) {
    console.log(orderCode);
    let query = this.dbRef;
    query = query.where("orderCode", "==", Number(orderCode));
    const snapshot = await query.get();
    console.log(snapshot);
    const results = snapshot.docs.map((item) => item.id);
    console.log(results);
    if (results.length <= 0) {
      throw new AppError("Không tìm thấy thông tin thu nhập");
    }
    const id = results[0];
    await this.dbRef.doc(id).update({ refundStatus: refundStatus });
  }
}

export default new IncomeRepo();
