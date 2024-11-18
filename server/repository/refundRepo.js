import firebaseAdmin from "../firebase/firebaseAdmin";

class RefundRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("refundRequest");
  }

  async createRefund(uid, refund) {
    const doc = await this.dbRef.doc(uid).get();
    const data = doc.exists ? doc.data() : {};
    let refunds = data.refunds ? data.refund : [];
    refunds.push(refund);
    await this.dbRef.set({ ...data });
  }
}

export default new RefundRepo();
