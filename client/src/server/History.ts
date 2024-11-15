import BaseApi from "./BaseApi";

interface Course {
  courseId: string;
  title: string;
  price: number;
}

interface Purchase {
  code: string;
  boughtAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  sku: Course[];
  total: number;
}

interface HistoryResponse {
  status: string;
  message: {
    purchase: Purchase[];
    total: number;
  };
}

class HistoryApi extends BaseApi {
  constructor() {
    super("/purchase");
  }

  public async getHistory(token: string): Promise<HistoryResponse> {
    const response = await this.get(`/purchase`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const historyApi = new HistoryApi();
