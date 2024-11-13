// pages/course/edit/[id].tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { courseApi } from "@/server/Cource";
import { CircularProgress, Box, Typography } from "@mui/material";
import CreateCourseView from "@/layouts/dashboard/teacher/cource/CreateCourceView";

const EditCoursePage: React.FC = () => {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const response = await courseApi.getCourseDetail(id as string);
        if (response.status === "Successfully") {
          const courseDetail = response.message;
          const formattedCourse: any = {
            title: courseDetail.title,
            description: courseDetail.description,
            category: courseDetail.category,
            price: courseDetail.price,
            language: courseDetail.language,
            level: courseDetail.level,
            thumbnail: null,
            requirements: courseDetail.requirements,
            whatYouWillLearn: courseDetail.whatYouWillLearn,
            content: courseDetail.content.map((section) => ({
              sectionTitle: section.sectionTitle,
              lectures: section.lectures.map((lecture) => ({
                title: lecture.title,
                duration: lecture.duration,
                type: lecture.type,
                videoUrl: lecture.videoUrl,
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
  ) : null;
};

export default EditCoursePage;
