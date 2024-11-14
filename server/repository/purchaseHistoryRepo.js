import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

const PurchaseStatus = {
  sold: "Đã mua",
  refund: "Đã hoàn tiền",
};

class PurchaseHistory {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("purchaseHistory");
  }

  async createPurchase(uid, data) {
    const doc = await this.dbRef.doc(uid).get();
    let purchase = doc.data().purchase;
    if (purchase) {
      const id = `MKT_${uid}${Date.now()}`;
      const history = {
        code: id,
        boughtAt: new Date(),
        ...data,
      };
      purchase.push(history);
      const total = purchase.length;
      await this.dbRef.doc(uid).set({ purchase: purchase, total: total });
      return "Tạo đơn hàng thành công";
    }
    throw new AppError("Lỗi truy cập lịch sử mua hàng!");
  }

  async getAllPurchases(uid) {
    const snapshot = await this.dbRef.doc(uid).get();
    const data = snapshot.data();
    return {
      ...data,
    };
  }
}

export default new PurchaseHistory();
