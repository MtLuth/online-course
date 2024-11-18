// pages/course/edit/[id].tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { courseApi } from "@/server/Cource";
import { CircularProgress, Box, Typography } from "@mui/material";
import CreateCourseView, {
  CourseData,
} from "@/layouts/dashboard/teacher/cource/CreateCourceView";
import { getAuthToken } from "@/utils/auth";

const EditCoursePage: React.FC = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [initialValues, setInitialValues] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const token = getAuthToken();
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        const response = await courseApi.getCourseDetailIns(
          id as string,
          token
        );
        if (response.status === "Successfully" && response.message) {
          const courseDetail = response.message;

          const formattedCourse: CourseData = {
            title: courseDetail.title,
            description: courseDetail.description,
            category: courseDetail.category,
            price: courseDetail.price,
            language: courseDetail.language,
            level: courseDetail.level,
            thumbnail: courseDetail.thumbnail,
            requirements: courseDetail.requirements || [""],
            whatYouWillLearn: courseDetail.whatYouWillLearn || [""],
            content: courseDetail.content.map((section: any) => ({
              sectionTitle: section.sectionTitle,
              lectures: section.lectures.map((lecture: any) => ({
                title: lecture.title,
                duration: lecture.duration,
                type: lecture.type,
                videoUrl: lecture.videoUrl,
                videoFile: null,
                description: lecture.description || "",
                resources: lecture.resources || [],
              })),
            })),
            isPublished: courseDetail.isPublished,
          };

          setInitialValues(formattedCourse);
        } else {
          setError(response.message || "Không thể tải chi tiết khóa học.");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải chi tiết khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ flexGrow: 1, padding: 16 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return initialValues ? (
    <CreateCourseView
      initialValues={initialValues}
      isEditMode={true}
      courseId={id as string}
    />
  ) : (
    <Box sx={{ flexGrow: 1, padding: 16 }}>
      <Typography variant="h6" align="center">
        Không tìm thấy khóa học.
      </Typography>
    </Box>
  );
};

export default EditCoursePage;
