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

  async deleteCategoryById(id) {
    await this.dbRef.doc(id).delete();
    return "Đã xóa category!";
  }

  async updateCategory(id, newData) {
    const doc = await this.dbRef.doc(id).get();
    const data = doc.data();
    const keys = Object.keys(newData);
    keys.forEach(([key, value]) => {
      if (!data.hasOwnProperty(key)) {
        delete newData[key];
      }
    });

    await this.dbRef.doc(id).update({ ...newData });
    return "Cập nhật category thành công!";
  }
}

export default new Category();
