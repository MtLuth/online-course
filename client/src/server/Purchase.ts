import BaseApi from "./BaseApi";

interface PurchaseData {
  courses: string[];
}

class PurchaseApi extends BaseApi {
  constructor() {
    super("/purchase");
  }

  public async purchaseCourse(data: PurchaseData, token: string): Promise<any> {
    const response = await this.post(`/purchase`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const purchaseApi = new PurchaseApi();
