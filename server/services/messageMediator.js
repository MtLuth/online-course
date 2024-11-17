import firebaseAdmin from "../firebase/firebaseAdmin.js";
import userRepo from "../repository/userRepo.js";
import AppError from "../utils/appError.js";

class MessageMediator {
  constructor(uid1, uid2) {
    this.uid1 = uid1;
    this.uid2 = uid2;
    this.db = firebaseAdmin.database();
  }

  loadMessages(uid1, uid2) {}

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
      this.notify(receiver, message);
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

  notify(receiver, message) {
    console.log(
      `Thông báo: ${receiver.name} có tin nhắn mới từ ${message.sender}: ${message.content}`
    );
  }
}

export default MessageMediator;
