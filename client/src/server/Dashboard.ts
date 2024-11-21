import BaseApi from "./BaseApi";

class DashboardApi extends BaseApi {
  constructor() {
    super("/dashboard");
  }

  public async getAdmin(): Promise<any> {
    const response = await this.get(`/dashboard/admin`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }
  public async getIns(token: string): Promise<any> {
    const response = await this.get(`/dashboard/instructor`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const dashboardApi = new DashboardApi();
