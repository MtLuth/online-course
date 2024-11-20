import BaseApi from "./BaseApi";
interface WithdrawData {
  bankName: string;
  bankNumber: string;
  amount: number;
}
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

  public async withDraw(data: WithdrawData, token: string): Promise<any> {
    const response = await this.post(`/withdraw`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  public async bank(): Promise<any> {
    const response = await this.get(`/bank`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const paymentApi = new PaymentApi();
