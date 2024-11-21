import firebaseAdmin from "../firebase/firebaseAdmin.js";
import AppError from "../utils/appError.js";

class WalletRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("wallet");
  }

  async updateWallet(uid, newWallet) {
    try {
      const doc = await this.dbRef.doc(uid).get();
      const wallet = doc.exists
        ? doc.data()
        : {
            inProgress: 0,
            withdrawable: 0,
            withdrawPending: 0,
            withdrawnAmount: 0,
          };
      let keys = Object.keys(newWallet);
      keys.forEach((key) => {
        if (wallet.hasOwnProperty(key)) {
          wallet[key] += newWallet[key];
        }
      });
      await this.dbRef.doc(uid).set({ ...wallet });
    } catch (error) {
      throw new AppError(`Lỗi trong quá trình cập nhật wallet: ${error}`, 400);
    }
  }

  async getWalletByUid(uid) {
    const doc = await this.dbRef.doc(uid).get();
    console.log(uid);
    const data = doc.exists
      ? doc.data()
      : {
          inProgress: 0,
          withdrawable: 0,
          withdrawnAmount: 0,
          withdrawPending: 0,
        };
    console.log(data);
    return {
      uid: doc.id,
      ...data,
    };
  }
}

export default new WalletRepo();
