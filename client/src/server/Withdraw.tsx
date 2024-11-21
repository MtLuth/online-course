import BaseApi from "./BaseApi";

class WithdrawApi extends BaseApi {
  constructor() {
    super("/refund");
  }

  public async withdrawAdmin(token: string): Promise<any> {
    const response = await this.get(`/withdraw/admin`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  public async WithdrawPutAdmin(id: string, token: string): Promise<any> {
    const response = await this.put(`/refund/cancel/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  public async cWithdrawUser(
    payload: RefundPayload,
    token: string
  ): Promise<any> {
    const response = await this.post(`/withdraw`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const withdrawApi = new WithdrawApi();
