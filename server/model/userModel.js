class User {
  constructor(uid, fullName, email, status) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
    this.status = status;
  }
}

const userConverter = {
  toFirestore: (user) => {
    return {
      fullName: user.fullName,
      email: user.email,
      status: user.status,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(data.id, data.fullName, data.email, data.status);
  },
};

export { User, userConverter };
