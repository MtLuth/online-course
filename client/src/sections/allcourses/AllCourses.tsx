import CoursesList from "@/components/coursecard/CoursesList";
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

  const isPublished =
    searchParams.isPublished !== undefined
      ? searchParams.isPublished === "true"
      : undefined;

  const orderByPrice = Array.isArray(searchParams.orderByPrice)
    ? searchParams.orderByPrice[0]
    : searchParams.orderByPrice || "asc";

  // Fetch courses from the API
  const coursesResponse = await courseApi.getAllCourses(
    page,
    limit,
    searchParam,
    isPublished,
    orderByPrice
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
      isPublished={isPublished}
      orderByPrice={orderByPrice}
      showEdit={false} // Hide edit button on All Courses page
    />
  );
};

export default AllCourses;
