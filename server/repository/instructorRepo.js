import firebaseAdmin from "../firebase/firebaseAdmin.js";

class InstructorRepo {
  constructor() {
    this.dbRef = firebaseAdmin.firestore().collection("instructors");
  }

  async updateStatus(uid, status) {
    const doc = await this.dbRef.doc(uid);
    if (doc) {
      await doc.update({
        status: status,
      });
    }
    return "Cập nhật trạng thái thành công!";
  }

  async getAllInstructor(status) {
    let query = this.dbRef;
    if (status != null) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    return snapshot;
  }

  async getInstructorByUid(uid) {
    const doc = await this.dbRef.doc(uid).get();
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    };
  }
}

export default new InstructorRepo();
