class User {
  constructor(uid, fullName, email) {
    this.uid = uid;
    this.fullName = fullName;
    this.email = email;
  }
}

const userConverter = {
  toFirestore: (user) => {
    return {
      fullName: user.fullName,
      email: user.email,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(data.id, data.fullName, data.email);
  },
};

export { User, userConverter };
