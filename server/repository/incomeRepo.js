import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

class IncomeRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("incomes");
  }

  async addIncome(uid, income) {
    const docRef = await this.dbRef.add({ uid: uid, ...income });
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
}

export default new IncomeRepo();
