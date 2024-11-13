import CoursesList from "@/components/coursecard/CoursesList";
import { cookies } from "next/headers";
import { courseApi } from "@/server/Cource";

const MyCourses = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  const courses = await courseApi.getAllMyCourses(token);
  return <CoursesList courses={courses?.message} />;
};

export default MyCourses;
