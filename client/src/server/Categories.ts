import BaseApi from "./BaseApi";

class CategoriesApi extends BaseApi {
  constructor() {
    super("/category");
  }

  public async getCategories(token: string): Promise<any> {
    const response = await this.get(`/category`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
  public async addCategories(data: any, token: string): Promise<any> {
    const response = await this.post(`/category`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
  public async updateCategories(data: any, token: string): Promise<any> {
    const response = await this.put(`/category/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
  public async deleteCategories(id: string, token: string): Promise<any> {
    const response = await this.delete(`/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const categoriesApi = new CategoriesApi();
