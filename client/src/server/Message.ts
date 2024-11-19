import BaseApi from "./BaseApi";

class MessageApi extends BaseApi {
  constructor() {
    super("/message");
  }

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

    const response = await this.post(
      `http://localhost:8080/api/v1/message/${id}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  }

  public listenNewMessage(
    id: string,
    token: string,
    onMessage: (data: any) => void
  ): EventSource {
    const eventSource = new EventSource(
      `http://localhost:8080/api/v1/message/listen/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return eventSource;
  }

  public async conversationMsg(token: string): Promise<any> {
    const response = await this.get(`/conversation`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const messageApi = new MessageApi();
