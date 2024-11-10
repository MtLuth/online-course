import firebaseAdmin from "../firebase/firebaseAdmin";

class Student {
  constructor(uid, fullName, dob) {
    this.uid = uid || null;
    this.fullName = fullName || null;
    this.dob = dob || null;

    this.dbRef = firebaseAdmin.firestore().collection("students");
  }

  toFirestore() {
    return {
      fullName: this.fullName,
      dob: this.dob,
    };
  }

  fromFireStore(snapshot) {
    const data = snapshot.data();
    return new Student(snapshot.id, data.fullName, data.dob);
  }

  async save() {
    const snapshot = this.toFirestore();
    await this.dbRef.doc(this.uid).set(snapshot);
  }
}
