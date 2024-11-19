import firebaseAdmin from "../firebase/firebaseAdmin.js";
import { RefundStatus } from "../model/refundModel.js";

class RefundRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("refundRequest");
  }

  async createRefund(uid, refund) {
    const doc = await this.dbRef.doc(uid).get();
    const data = doc.exists ? doc.data() : {};
    let refunds = data.refunds ? data.refunds : [];
    refunds.push({ ...refund, uid: uid });
    await this.dbRef.doc(uid).set({ refunds: refunds, date: Date.now() });
  }

  async getAllRefund(filterStatus) {
    let query = this.dbRef;
    const snapshot = await this.dbRef.get();
    let results = [];
    const docs = snapshot.docs;
    docs.forEach((doc) => {
      results = results.concat(doc.data().refunds);
    });
    if (filterStatus !== undefined && filterStatus !== "") {
      results = results.filter(
        (item) => item.status === RefundStatus[filterStatus]
      );
    }
    return results;
  }
}

export default new RefundRepo();
