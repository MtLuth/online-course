import firebaseAdmin from "../firebase/firebaseAdmin.js";
import userRepo from "../repository/userRepo.js";
import AppError from "../utils/appError.js";

class MessageMediator {
  constructor(uid1, uid2) {
    this.uid1 = uid1;
    this.uid2 = uid2;
    this.db = firebaseAdmin.database();
  }

  async loadMessages() {
    try {
      const conversationId = this.getConversationKey();
      const messages = await this.db
        .ref(`conversations/${conversationId}/messages`)
        .get();

      const results = [];
      messages.forEach((snapshot) => {
        const message = snapshot.val().message;
        const messageWithKey = {
          key: snapshot.key,
          message: message,
        };
        results.push(messageWithKey);
      });

      return results;
    } catch (error) {
      throw new AppError(`Lỗi khi tải tin nhắn: ${error}`);
    }
  }

  async sendMessage(sender, receiver, contentType, content) {
    try {
      const validUser = await userRepo.getUserByUid(receiver);

      const conversationId = this.getConversationKey();

      const message = {
        sender: sender,
        receiver: validUser.uid,
        content: content,
        contentType: contentType,
      };
      await this.db
        .ref(`conversations/${conversationId}/messages`)
        .push({ message });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        throw new AppError(`Không tìm thấy người nhận!`, 400);
      }
      throw new AppError(`Lỗi khi gửi tin nhắn: ${error}`, 500);
    }
  }

  getConversationKey() {
    const conversationId =
      this.uid1 < this.uid2
        ? `${this.uid1}_${this.uid2}`
        : `${this.uid2}_${this.uid1}`;
    return conversationId;
  }

  listenToNewMessage(res) {
    const conversationId = this.getConversationKey();
    const messagesRef = this.db.ref(`conversations/${conversationId}/messages`);

    messagesRef.on("child_added", (snapshot) => {
      const message = snapshot.val();
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }
}

export default MessageMediator;
