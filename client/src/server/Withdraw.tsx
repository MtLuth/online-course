import BaseApi from "./BaseApi";

class WithdrawApi extends BaseApi {
  constructor() {
    super("/refund");
  }

  public async withdrawAdmin(
    token: string,
    limit: number = 10,
    page: number = 1,
    status?: string
  ): Promise<any> {
    const params: Record<string, string> = {
      limit: limit.toString(),
      page: page.toString(),
    };

    if (status) {
      params.status = status;
    }

    const response = await this.get(`/withdraw/admin`, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  }

  public async WithdrawPutAdmin(
    id: string,
    data: { status: string; reason?: string },
    token: string
  ): Promise<any> {
    const response = await this.put(`/withdraw/admin/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  public async getWithdrawAdmin(id: string, token: string): Promise<any> {
    const response = await this.get(`/withdraw/admin/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const withdrawApi = new WithdrawApi();
