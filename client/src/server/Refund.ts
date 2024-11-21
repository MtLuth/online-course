import BaseApi from "./BaseApi";

interface PayeeAccount {
  bankNumber: string;
  bankName: string;
  receiverName: string;
}

interface RefundPayload {
  payeeAccount: PayeeAccount;
  reason: string;
  courses: string[];
  orderCode: string;
}

class RefundApi extends BaseApi {
  constructor() {
    super("/refund");
  }

  public async refundUser(token: string): Promise<any> {
    const response = await this.get(`/refund/student`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  public async refundPutUser(id: string, token: string): Promise<any> {
    const response = await this.put(`/refund/cancel/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  public async cRefundUser(
    payload: RefundPayload,
    token: string
  ): Promise<any> {
    const response = await this.post(`/refund`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const refundApi = new RefundApi();
