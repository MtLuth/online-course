// sections/allcourses/AllCourses.tsx

import CoursesList from "@/components/coursecard/CoursesList";
import { cookies } from "next/headers";
import { GetAllCoursesResponse } from "@/interfaces/CourseDetail";
import { jwtDecode } from "jwt-decode";
import { courseApi } from "@/server/Cource";

interface AllCoursesProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const AllCourses = async ({ searchParams }: AllCoursesProps) => {
  // Extract query parameters with default values
  const page =
    parseInt(
      Array.isArray(searchParams.page)
        ? searchParams.page[0]
        : searchParams.page
    ) || 1;

  const limit =
    parseInt(
      Array.isArray(searchParams.limit)
        ? searchParams.limit[0]
        : searchParams.limit
    ) || 10;

  const searchParam = Array.isArray(searchParams.searchParam)
    ? searchParams.searchParam[0]
    : searchParams.searchParam || "";

  const category = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category || "";

  const isPublished =
    searchParams.isPublished !== undefined
      ? searchParams.isPublished === "true"
      : undefined;

  const orderByPrice = Array.isArray(searchParams.orderByPrice)
    ? searchParams.orderByPrice[0]
    : searchParams.orderByPrice || "asc";
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value || null;

  let uid = "";
  if (token) {
    try {
      // Giải mã token
      const decoded: any = jwtDecode(token);
      if (decoded && decoded.user_id) {
        uid = decoded.user_id;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  console.log(uid);
  const coursesResponse: GetAllCoursesResponse = await courseApi.getAllCourses(
    page,
    limit,
    searchParam,
    category,
    isPublished,
    orderByPrice,
    uid
  );

  const courses = coursesResponse?.message?.results || [];
  const itemCount = coursesResponse?.message?.itemCount || 0;
  const pageCount = coursesResponse?.message?.pageCount || 1;

  return (
    <CoursesList
      courses={courses}
      page={page}
      pageCount={pageCount}
      itemCount={itemCount}
      limit={limit}
      searchParam={searchParam}
      category={category}
      isPublished={isPublished}
      orderByPrice={orderByPrice}
      showEdit={false}
    />
  );
};

export default AllCourses;
