class Token {
  constructor(email, uid, value, expiredAt) {
    this.email = email;
    this.uid = uid;
    this.value = value;
    this.expiredAt = expiredAt;
  }
  toFirestore() {
    return {
      value: this.value,
      uid: this.uid,
      expiredAt: this.expiredAt,
    };
  }
  static fromFirestore(snapshot) {
    const data = snapshot.data();
    return new Token(snapshot.id, data.uid, data.value, data.expiredAt);
  }
}

export default Token;
