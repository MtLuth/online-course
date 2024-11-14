import firebaseAdmin from "../firebase/firebaseAdmin.js";

class Category {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("category");
  }

  async createCategory(data) {
    await this.dbRef.doc(data.name).set({ ...data });
    return "Tạo category mới thành công";
  }

  async getAllCategory() {
    const snapshot = await this.dbRef.get();
    const categories = snapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    return categories;
  }
}

export default new Category();
