import firebaseAdmin from "../firebase/firebaseAdmin.js";

class Category {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("category");
  }

  async createCategory(data) {
    await this.dbRef.add({ ...data });
    return "Tạo category mới thành công";
  }

  async getAllCategory() {
    const snapshot = await this.dbRef.get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return categories;
  }

  async deleteCategory(name) {
    await this.dbRef.doc(name).delete();
    return "Đã xóa category!";
  }

  async updateCategory(name) {
    const doc = await this.dbRef.doc(name);
    // const date = await.
  }
}

export default new Category();
