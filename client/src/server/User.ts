import BaseApi from "./BaseApi";

class UserApi extends BaseApi {
  constructor() {
    super("/user");
  }

  public async profileUser(id: string, token: string): Promise<any> {
    const response = await this.get(`/user/profile/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export const userApi = new UserApi();
