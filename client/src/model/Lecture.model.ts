// model/Lecture.model.ts

export interface LectureType {
  id: string;
  title: string;
  duration: string;
  description: string;
  type: "video" | "article";
  videoUrl: string;
  resources?: {
    title: string;
    fileUrl: string;
  }[];
}
