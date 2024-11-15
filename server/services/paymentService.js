import PayOs from "@payos/node";
import AppError from "../utils/appError.js";
class PaymentService {
  constructor() {
    const clientId = "e6eed2dd-86ea-4758-b0ab-f49b28057aae";
    const apiKey = "188c9c69-5a90-4c1c-a0f6-78b710b29fdd";
    const checksumKey =
      "e5a95f3b4f48d9812a9ada502aab43d0a6cfa93f4405a7be39335f75003c878d";
    this.payOs = new PayOs(clientId, apiKey, checksumKey);
  }
  async createPayment(orderCode, courses, total, returnUrl, cancelUrl) {
    console.log(returnUrl);
    const body = {
      orderCode: orderCode,
      amount: total,
      description: "Thanh toán Elearning",
      items: courses,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
    };
    try {
      const paymentLinkResponse = await this.payOs.createPaymentLink(body);
      return paymentLinkResponse;
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  async getPaymentLinkInfor(id) {
    try {
      const paymentLink = await this.payOs.getPaymentLinkInformation(id);
      return paymentLink;
    } catch (error) {
      throw new AppError(error, 500);
    }
  }
}

export default new PaymentService();