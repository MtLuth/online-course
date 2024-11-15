import BaseApi from "./BaseApi";

class CartApi extends BaseApi {
  constructor() {
    super("/cart");
  }

  public async addToCart(courseId: string, token: string): Promise<any> {
    const response = await this.post(`/cart/add/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const cartApi = new CartApi();
