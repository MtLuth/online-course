import MyCourses from "@/sections/profile/MyCourse";

export const metadata = {
  title: "Các Khóa Học Của Tôi | Elearning",
};
export default function RegisterInstructor({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return <MyCourses searchParams={searchParams} />;
}
