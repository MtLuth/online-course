// sections/profile/MyCourses.tsx

"use client";

import React, { useEffect, useState } from "react";
import CoursesList from "@/components/coursecard/CoursesList";
import { courseApi } from "@/server/Cource";
import { CourseDetail } from "@/interfaces/CourseDetail";
import { getAuthToken } from "@/utils/auth";

interface MyCoursesProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const MyCourses: React.FC<MyCoursesProps> = ({ searchParams }) => {
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(
    parseInt(
      Array.isArray(searchParams.page)
        ? searchParams.page[0]
        : searchParams.page
    ) || 1
  );
  const [limit, setLimit] = useState<number>(
    parseInt(
      Array.isArray(searchParams.limit)
        ? searchParams.limit[0]
        : searchParams.limit
    ) || 10
  );
  const [searchParam, setSearchParam] = useState<string>(
    Array.isArray(searchParams.searchParam)
      ? searchParams.searchParam[0]
      : searchParams.searchParam || ""
  );
  const [isPublished, setIsPublished] = useState<boolean | undefined>(
    searchParams.isPublished !== undefined
      ? searchParams.isPublished === "true"
      : undefined
  );
  const [orderByPrice, setOrderByPrice] = useState<string>(
    Array.isArray(searchParams.orderByPrice)
      ? searchParams.orderByPrice[0]
      : searchParams.orderByPrice || "asc"
  );

  useEffect(() => {
    const fetchMyCourses = async () => {
      const token = getAuthToken();

      if (!token) {
        console.error("User not authenticated.");
        return;
      }

      try {
        const response = await courseApi.getAllMyCourses(
          token,
          page,
          limit,
          searchParam,
          isPublished
        );
        if (response.status === "Successfully") {
          setCourses(response.message.results);
          setItemCount(response.message.itemCount);
          setPageCount(Math.ceil(response.message.itemCount / limit));
        } else {
          // Handle error response
          console.error(response.message);
        }
      } catch (error) {
        console.error("Error fetching my courses:", error);
      }
    };

    fetchMyCourses();
  }, [page, limit, searchParam, isPublished]);

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
      showEdit={true} // Show edit button in My Courses
    />
  );
};

export default MyCourses;
