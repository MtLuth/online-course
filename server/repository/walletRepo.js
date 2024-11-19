import firebaseAdmin from "../firebase/firebaseAdmin.js";

class WalletRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("wallet");
  }

  async updateWallet(uid, newWallet) {
    const doc = await this.dbRef.doc(uid).get();
    const wallet = doc.exists
      ? doc.data()
      : {
          inProgress: 0,
          withdrawable: 0,
          withdrawnAmount: 0,
          refundRequest: 0,
        };
    let keys = Object.keys(newWallet);
    keys.forEach((key) => {
      if (wallet.hasOwnProperty(key)) {
        wallet[key] += newWallet[key];
      }
    });
    await this.dbRef.doc(uid).set({ ...wallet });
  }

  async getWalletByUid(uid) {
    const doc = await this.dbRef.doc(uid).get();
    const data = doc.exists
      ? doc.data()
      : {
          inProgress: 0,
          withdrawable: 0,
          withdrawnAmount: 0,
          refundRequest: 0,
        };
    return {
      uid: doc.id,
      ...data,
    };
  }
}

export default new WalletRepo();
