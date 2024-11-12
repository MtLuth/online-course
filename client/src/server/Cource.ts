import BaseApi from "./BaseApi";

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

class Course extends BaseApi {
  constructor() {
    super("/course");
  }

  public async createCourse(
    data: CreateCourseData,
    token: string
  ): Promise<{ status: string; message?: string }> {
    const response = await this.post(`/course`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }
}

export const courseApi = new Course();
