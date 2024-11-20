import firebaseAdmin from "../firebase/firebaseAdmin.js";

class BankRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("bank");
  }

  async getAllBank() {
    const snapshot = await this.dbRef.get();
    const results = snapshot.docs.map((doc) => {
      return { ...doc.data() };
    });
    return results;
  }
}

export default new BankRepo();
