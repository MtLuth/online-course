import firebaseAdmin from "../firebase/firebaseAdmin.js";
import userRepo from "../repository/userRepo.js";
import AppError from "../utils/appError.js";

class MessageMediator {
  constructor(uid1, uid2) {
    this.uid1 = uid1;
    this.uid2 = uid2;
    this.db = firebaseAdmin.database();
  }

  loadMessagesRealtime(onNewMessage) {
    const conversationId = this.getConversationKey();
    const ref = this.db.ref(`conversations/${conversationId}/messages`);

    // ref.once("value", (snapshot) => {
    //   const results = [];
    //   snapshot.forEach((childSnapshot) => {
    //     const message = childSnapshot.val();
    //     const messageWithKey = {
    //       key: childSnapshot.key,
    //       ...message,
    //     };
    //     results.push(messageWithKey);
    //   });

    //   onMessagesLoaded(results);
    // });

    this.listener = ref.on("child_added", (childSnapshot) => {
      const newMessage = {
        key: childSnapshot.key,
        ...childSnapshot.val(),
      };

      onNewMessage(newMessage);
    });
  }

  stopListening() {
    if (this.listener) {
      const conversationId = this.getConversationKey();
      const ref = this.db.ref(`conversations/${conversationId}/messages`);
      ref.off("value", this.listener);
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
        date: Date.now(),
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
}

export default MessageMediator;
