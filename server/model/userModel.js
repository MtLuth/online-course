const UserRole = {
  Admin: "admin",
  Student: "student",
  Teacher: "teacher",
};
class User {
  constructor(uid, fullName, email, role, phoneNumber) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.role = role;
    this.phoneNumber = phoneNumber;
  }
  toFirestore() {
    return {
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      phoneNumber: this.phoneNumber,
    };
  }
  static fromFirestore(snapshot) {
    const data = snapshot.data();
    return new User(
      data.id,
      data.fullName,
      data.email,
      data.role,
      data.phoneNumber
    );
  }
}

export default User;
export { UserRole };
