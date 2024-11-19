import BaseApi from "./BaseApi";

class MessageApi extends BaseApi {
  constructor() {
    super("/wallet");
  }

  // API gửi tin nhắn
  public async messageSend(
    id: string,
    content: string,
    contentType: "image" | "text" | "icon" | "sticker",
    token: string
  ): Promise<any> {
    const data = {
      content,
      contentType,
    };

    const response = await this.post(`/message/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  // API lắng nghe tin nhắn của người dùng
  public async listenMessage(id: string, token: string): Promise<any> {
    const response = await this.get(`/message/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  // API lắng nghe tin nhắn mới
  public async listenNewMessage(id: string, token: string): Promise<any> {
    const response = await this.get(`/message/listen/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const messageApi = new MessageApi();
