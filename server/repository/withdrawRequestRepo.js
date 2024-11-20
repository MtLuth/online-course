import firebaseAdmin from "../firebase/firebaseAdmin.js";

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
      query = query.where("status", "==", status);
    }
    const snapshot = await query.get();
    const results = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    return results;
  }
}

export default new WithdrawRequestRepo();
export { WithdrawStatus };
