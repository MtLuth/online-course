import firebaseAdmin from "../firebase/firebaseAdmin.js";

const PurchaseStatus = {
  succeed: "Thành công",
  refund: "Đã hoàn tiền",
  pending: "Đang chờ thanh toán",
};

class PurchaseHistory {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("purchaseHistory");
  }

  async createPurchase(uid, data, status) {
    const id = String(Date.now()).slice(-6);
    await this.dbRef.doc(id).set({
      uid: uid,
      ...data,
      boughtAt: new Date(),
      status,
    });
    return id;
  }

  async getAllPurchases(uid) {
    const snapshot = await this.dbRef.get();
    const purchases = snapshot.docs
      .filter((doc) => String(doc.data().uid) === uid)
      .map((doc) => ({ code: doc.id, ...doc.data() }));

    return {
      prchases: purchases,
    };
  }

  async deletePurchase(code) {
    await this.dbRef.doc(code).delete();
    return "Đã xóa đơn hàng!";
  }

  async updateStatusPurchase(code, status) {
    await this.dbRef.doc(code).update({ status: status });
    return "Cập nhật mới thành công!";
  }

  async getPurchaseByCode(code) {
    const doc = await this.dbRef.doc(code).get();
    const data = doc.data();
    if (doc) {
      return {
        code: doc.id,
        ...data,
      };
    }
    return null;
  }

  async updateRefundStatus(orderCode, coursesRefund, status) {
    const doc = await this.dbRef.doc(orderCode).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    const sku = data.sku;
    coursesRefund = coursesRefund.map((item) => item.courseId);

    console.log(coursesRefund);
    const newSku = sku.reduce((results, item) => {
      if (coursesRefund.includes(item.courseId)) {
        results.push({ ...item, refundStatus: status });
      }
      return results;
    }, []);
    console.log(newSku);
    await this.dbRef.doc(orderCode).update({ sku: newSku });
  }

  async getIncomeAdmin() {
    const snapshot = await this.dbRef
      .where("status", "!=", PurchaseStatus.refund)
      .get();
    const results = snapshot.docs.reduce(
      (sum, item) => sum + item.data().total,
      0
    );
    return {
      amount: results * 0.06,
      order: (await this.dbRef.get()).docs.length,
    };
  }

  async getPurchaseOfInstructor(uid) {
    let courses = [];
    const snapshot = await this.dbRef
      .where("status", "!=", PurchaseStatus.refund)
      .get();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const filterCourses = data.sku.filter((item) => item.instructor === uid);
      courses = courses.concat(filterCourses);
    });
    const amount = courses.reduce((sum, item) => sum + item.salePrice, 0);
    return {
      amount: amount * 0.94,
      order: courses.length,
    };
  }
}

export default new PurchaseHistory();
export { PurchaseStatus };
