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
    const user = await firebaseAdmin.auth().getUser(uid);
    let email;
    if (user) {
      email = user.email;
    }
    refunds.push({ ...refund, uid: uid, email: email, date: Date.now() });
    await this.dbRef.doc(uid).set({ refunds: refunds });
  }

  async getAllRefund(filterStatus) {
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
    results = results.sort((a, b) => b.date - a.date);
    return results;
  }

  async viewDetailRefund(uid, id) {}
}

export default new RefundRepo();
