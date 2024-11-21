import AllCourses from "@/sections/allcourses/AllCourses";

export const metadata = {
  title: "Tất cả các Khóa Học | Elearning",
};

export default function AllCoursesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <AllCourses searchParams={searchParams} />;
}
