import firebaseAdmin from "../firebase/firebaseAdmin.js";

class ConversationService {
  constructor() {
    this.db = firebaseAdmin.database();
  }

  async getAllConversationKey(uid) {
    try {
      const snapshot = await this.db.ref(`conversations`).get();

      if (!snapshot.exists()) {
        return [];
      }

      let conversations = Object.keys(snapshot.val());
      conversations = await conversations.filter((item) => item.includes(uid));
      const result = await Promise.all(
        conversations.map(async (item) => {
          const otherUserId = item.replace(uid, "").replace("_", "");

          const user = await firebaseAdmin.auth().getUser(otherUserId);

          return {
            uid: user.uid,
            avt:
              user.avt ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png",
            fullName: user.displayName,
          };
        })
      );

      return result;
    } catch (error) {
      throw new Error(`Lỗi khi lấy các conversation key: ${error.message}`);
    }
  }
}

export default new ConversationService();
