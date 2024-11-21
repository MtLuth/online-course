import firebaseAdmin from "../firebase/firebaseAdmin.js";
import { RefundStatus } from "../model/refundModel.js";
import purchaseHistoryRepo from "./purchaseHistoryRepo.js";

class RefundRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("refundRequest");
  }

  async createRefund(uid, refund) {
    let refunds = [];
    const user = await firebaseAdmin.auth().getUser(uid);
    let email;
    if (user) {
      email = user.email;
    }
    refunds.push({ ...refund, uid: uid, email: email, date: Date.now() });
    await Promise.all([
      purchaseHistoryRepo.updateRefundStatus(
        refund.orderCode,
        refund.courses,
        true
      ),
      this.dbRef.add({ ...refund, uid: uid, email: email, date: Date.now() }),
    ]);
  }

  async getAllRefund(filterStatus) {
    let query = this.dbRef;
    if (filterStatus !== undefined && filterStatus !== "") {
      query = query.where("status", "==", RefundStatus[filterStatus]);
    }
    const snapshot = await query.get();
    const results = snapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .sort((a, b) => b.date - a.date);

    return results;
  }

  async viewDetailRefund(id) {
    const doc = await this.dbRef.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    return { id: doc.id, ...data };
  }

  async updateStatusRefund(id, status) {
    await this.dbRef.doc(id).update({ status: RefundStatus[status] });
    return "Cập nhật yêu cầu hoàn tiền thành công!";
  }

  async getAllRefundOfStudent(uid, status) {
    let query = this.dbRef;
    console.log(uid);
    query = query.where("uid", "==", uid);
    if (status !== undefined && status !== "") {
      query = query.where("status", "==", RefundStatus[status]);
    }
    const snapshot = await query.get();
    if (snapshot.empty) {
      return [];
    }
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return results;
  }

  async countRefundByStatus(status) {
    const snapshot = await this.dbRef.where("status", "==", status).get();
    const number = snapshot.docs.length;
    return number;
  }
}

export default new RefundRepo();
