import firebaseAdmin from "../firebase/firebaseAdmin.js";

class Instructor {
  constructor(
    uid,
    email,
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
    this.avt = avt || null;
    this.bio = bio || null;
    this.expertise = expertise || null;
    this.experience = experience || 0;
    this.education = education || null;
    this.certificages = certificages || null;
    this.rating = rating || null;
    this.review = review || null;

    this.dbRef = firebaseAdmin.firestore().collection("instructors");
  }

  toFirestore() {
    return {
      fullName: this.fullName,
      email: this.email,
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

  static fromFirestore(snapshot) {
    data = snapshot.data();
    return new Instructor(
      snapshot.id,
      data.email,
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
    const instructor = this.toFirestore();
    await this.dbRef.doc(this.uid).set(instructor);
  }
}

export default Instructor;
