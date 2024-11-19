import BaseApi from "./BaseApi";

class InstructorApi extends BaseApi {
  constructor() {
    super("/instructor");
  }

  public async instructorAll(
    page: number = 1,
    limit: number = 10,
    searchParam: string = "",
    status: string = "active"
  ): Promise<any> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: status,
    });

    if (searchParam.trim() !== "") {
      queryParams.append("searchParam", searchParam.trim());
    }

    const response = await this.get(`/instructor?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const instructorApi = new InstructorApi();
