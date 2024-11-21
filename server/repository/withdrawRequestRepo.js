import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

const WithdrawStatus = {
  Pending: "Chờ xử lý",
  Complete: "Hoàn thành",
  Cancel: "Đã hủy",
};

class WithdrawRequestRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("withDrawRequest");
  }

  async addNewRequest(uid, amount, bankName, bankNumber) {
    await this.dbRef.add({
      uid: uid,
      amount: amount,
      bankName: bankName,
      bankNumber: bankNumber,
      date: Date.now(),
      status: WithdrawStatus.Pending,
    });
  }

  async adminGetWithdrawRequest(status) {
    let query = this.dbRef;
    if (status) {
      query = query.where("status", "==", WithdrawStatus[status]);
    }
    const snapshot = await query.get();
    const results = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    return results;
  }

  async updateStatus(id, status) {
    const doc = await this.dbRef.doc(id).get();
    if (!doc.exists) {
      throw new AppError(`Không tìm thấy yêu cầu`, 400);
    }
    if (doc.data().status !== WithdrawStatus.Pending) {
      throw new AppError("Không thể chuyển trạng thái", 400);
    }
    if (doc.data().status !== WithdrawStatus[status]) {
      await this.dbRef.doc(id).update({ status: WithdrawStatus[status] });
    }
  }

  async getWithdrawById(id) {
    const doc = await this.dbRef.doc(id).get();
    if (!doc.exists) {
      throw new AppError(`Không tìm thấy yêu cầu`, 400);
    }
    return { id: doc.id, ...doc.data() };
  }

  async countNumberWithdrawByStatus(status) {
    const snapshot = await this.dbRef.where("status", "==", status).get();
    const number = snapshot.docs.length;
    return number;
  }
}

export default new WithdrawRequestRepo();
export { WithdrawStatus };
