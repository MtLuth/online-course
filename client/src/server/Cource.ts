// server/Cource.ts

import BaseApi from "./BaseApi";
import { Course } from "@/model/Course.model";

interface Resource {
  title: string;
  fileUrl: string;
}

interface Lecture {
  title: string;
  duration: string;
  type: string;
  videoUrl: string;
  resources?: Resource[];
}

interface Section {
  sectionTitle: string;
  lectures: Lecture[];
}

interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  price: number;
  language: string;
  level: string;
  thumbnail: string;
  requirements: string[];
  whatYouWillLearn: string[];
  content: Section[];
  isPublished: boolean;
}

interface GetAllCoursesResponse {
  status: string;
  message: {
    results: Course[];
    pageCount: number;
    itemCount: number;
    pages: { number: number; url: string }[];
  };
}

interface GetAllMyCoursesResponse {
  status: string;
  message: {
    results: Course[];
    itemCount: number;
  };
}

class CourseApi extends BaseApi {
  constructor() {
    super("/course");
  }

  public async createCourse(
    data: CreateCourseData,
    token: string
  ): Promise<{ status: string; message?: string }> {
    const response = await this.post(`/course/manage`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  public async getAllMyCourses(
    token: string,
    page: number = 1,
    limit: number = 5,
    searchParam?: string,
    isPublished?: boolean
  ): Promise<GetAllMyCoursesResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchParam) {
      queryParams.append("searchParam", searchParam);
    }

    if (isPublished !== undefined) {
      queryParams.append("isPublished", isPublished.toString());
    }

    const response = await this.get(
      `/course/manage?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }

  public async getAllCourses(
    page: number = 1,
    limit: number = 10,
    searchParam: string = "",
    isPublished?: boolean,
    orderByPrice: string = "asc"
  ): Promise<GetAllCoursesResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      orderByPrice,
    });

    if (searchParam.trim() !== "") {
      queryParams.append("searchParam", searchParam.trim());
    }

    if (isPublished !== undefined) {
      queryParams.append("isPublished", isPublished.toString());
    }

    const response = await this.get(`/course?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }
  public async getCourseDetail(id: string): Promise<any> {
    const response = await this.get(`/course/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }
  public async getLectureDetail(
    courseId: string,
    lectureId: string
  ): Promise<Lecture | null> {
    const response = await this.get(
      `/course/${courseId}/lecture/${lectureId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === "Successfully") {
      return response.message;
    }
    return null;
  }
  public async updateCourse(
    id: string,
    data: any,
    token: string
  ): Promise<any> {
    const response = await this.put(`/course/manage/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const courseApi = new CourseApi();
