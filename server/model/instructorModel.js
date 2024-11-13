import firebaseAdmin from "../firebase/firebaseAdmin.js";

const dbRef = firebaseAdmin.firestore().collection("instructors");

const InstructorStatus = {
  Active: "active",
  Pending: "pending",
};
class Instructor {
  constructor(
    uid,
    email,
    status,
    fullName,
    avt,
    bio,
    expertise,
    experience,
    education,
    certificages,
    rating,
    review
  ) {
    this.uid = uid || null;
    this.fullName = fullName || null;
    this.email = email || null;
    this.status = status || InstructorStatus.Pending;
    this.avt = avt || null;
    this.bio = bio || null;
    this.expertise = expertise || null;
    this.experience = experience || 0;
    this.education = education || null;
    this.certificages = certificages || null;
    this.rating = rating || null;
    this.review = review || null;
  }

  toFirestore() {
    return {
      fullName: this.fullName,
      email: this.email,
      status: this.status,
      avt: this.avt,
      bio: this.bio,
      expertise: this.expertise,
      experience: this.experience,
      education: this.education,
      certificages: this.certificages,
      rating: this.rating,
      review: this.review,
    };
  }

  fromFirestore(snapshot) {
    data = snapshot.data();
    return new Instructor(
      snapshot.id,
      data.email,
      data.status,
      data.fullName,
      data.avt,
      data.bio,
      data.expertise,
      data.experience,
      data.education,
      data.certificages,
      data.rating,
      data.education
    );
  }

  async save() {
    console.log(this.status);
    const instructor = this.toFirestore();
    await dbRef.doc(this.uid).set(instructor);
  }

  async getById(id) {
    const snapshot = await dbRef.doc(id).get();
    const data = snapshot.data();
    return new Instructor(
      snapshot.id,
      data.email,
      data.status,
      data.fullName,
      data.avt,
      data.bio,
      data.expertise,
      data.experience,
      data.education,
      data.certificages,
      data.rating,
      data.education
    );
  }
}

export default Instructor;

export { InstructorStatus };
