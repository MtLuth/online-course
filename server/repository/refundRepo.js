import firebaseAdmin from "../firebase/firebaseAdmin.js";
import { RefundStatus } from "../model/refundModel.js";
import purchaseHistoryRepo from "./purchaseHistoryRepo.js";

class RefundRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("refundRequest");
  }

  async createRefund(uid, refund) {
    // const doc = await this.dbRef.doc(uid).get();
    // const data = doc.exists ? doc.data() : {};
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
      query = query.where("status", "==", filterStatus);
    }
    const snapshot = await query.get();
    const results = snapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }))
      .sort((a, b) => b.date - a.date);

    return results;
  }

  async viewDetailRefund(id) {}
}

export default new RefundRepo();
