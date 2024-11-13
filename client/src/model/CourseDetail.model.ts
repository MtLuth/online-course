export interface Instructor {
  fullName: string;
  uid: string;
}

export interface LectureResource {
  title: string;
  fileUrl: string;
}

export interface Lecture {
  title: string;
  duration: string;
  type: "video" | "article";
  videoUrl: string;
  resources?: LectureResource[];
}

export interface ContentSection {
  sectionTitle: string;
  lectures: Lecture[];
}

export interface CourseDetail {
  id: string;
  instructor: Instructor;
  content: ContentSection[];
  whatYouWillLearn: string[];
  requirements: string[];
  updatedAt: number;
  thumbnail: string;
  level: string;
  language: string;
  price: number;
  category: string;
  description: string;
  title: string;
}
