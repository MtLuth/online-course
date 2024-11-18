import firebaseAdmin from "../firebase/firebaseAdmin.js";

const UserRole = {
  Admin: "admin",
  Student: "student",
  Teacher: "teacher",
};

const auth = firebaseAdmin.auth();
const dbRef = firebaseAdmin.firestore().collection("users");
class User {
  constructor(uid, fullName, email, password, phoneNumber, role, avt) {
    this.uid = uid || null;
    this.fullName = fullName || null;
    this.email = email || null;
    this.phoneNumber = phoneNumber || null;
    this.password = password || null;
    this.role = role || UserRole.Student;
    this.avt =
      avt ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png";
  }

  toFirestore() {
    return {
      role: this.role,
    };
  }
  static fromFirestore(snapshot) {
    const data = snapshot.data();
    const user = new User();
    user.role = data.role;
    user.uid = snapshot.id;
    return user;
  }
}

export default User;
export { UserRole };
