import firebaseAdmin from "../firebase/firebaseAdmin";

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

   async addInstructor(instructor) {
     await this.dbRef.doc(instructor.uid).set({
        fullName: 
     })
   }
}

export default new InstructorRepo();
