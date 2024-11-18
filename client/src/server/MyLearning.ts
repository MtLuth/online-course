import BaseApi from "./BaseApi";

interface GetMyLearningParams {
  searchParam?: string;
}

interface MyLearningResponse {
  status: string;
  message: Course[];
}

interface Course {
  courseId: string;
  title: string;
  price: number;
  salePrice?: number;
  description: string;
  thumbnail: string;
  level: string;
  instructor: string;
}

class MyLearningApi extends BaseApi {
  constructor() {
    super("/mylearnings");
  }

  public async getMyLearnings(
    token: string,
    params?: GetMyLearningParams
  ): Promise<MyLearningResponse> {
    let url = `/mylearnings`;
    if (params && params.searchParam) {
      const queryString = new URLSearchParams({
        searchParam: params.searchParam,
      }).toString();
      url += `?${queryString}`;
    }

    const response = await this.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const myLearningApi = new MyLearningApi();
