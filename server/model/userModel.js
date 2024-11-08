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
}

const userConverter = {
  toFirestore: (user) => {
    return {
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      role: user.role,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(data.id, data.fullName, data.email, data.status, data.role);
  },
};

export { User, userConverter, UserRole };
