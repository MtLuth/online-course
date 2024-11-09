const UserRole = {
  Admin: "admin",
  Student: "student",
  Teacher: "teacher",
};
class User {
  constructor(uid, fullName, email, status, role) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.status = status;
    this.role = role;
  }
  toFirestore() {
    return {
      fullName: this.fullName,
      email: this.email,
      status: this.status,
      role: this.role,
    };
  }
  fromFirestore(snapshot) {
    const data = snapshot.data;
    return new User(data.id, data.fullName, data.email, data.status, data.role);
  }
}

export default User;
export { UserRole };
