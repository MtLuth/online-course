import BaseApi from "./BaseApi";

class PaymentApi extends BaseApi {
  constructor() {
    super("/payment");
  }

  public async paymentCancel(id: string, token: string): Promise<any> {
    const response = await this.get(`/payment/cancel?orderCode=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const paymentApi = new PaymentApi();
