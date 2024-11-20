import BaseApi from "./BaseApi";

class WalletApi extends BaseApi {
  constructor() {
    super("/wallet");
  }

  public async walletGet(token: string): Promise<any> {
    const response = await this.get(`/wallet`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const walletApi = new WalletApi();
