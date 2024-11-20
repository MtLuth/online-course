"use client";

import React, { useEffect, useState } from "react";
import { CourseDetail as CourseDetailType } from "@/model/CourseDetail.model";
import { CircularProgress, Box, Typography } from "@mui/material";
import { courseApi } from "@/server/Cource";
import CourseDetail from "@/components/coursecard/CourseDetail";
import { useParams } from "next/navigation";

const CourseDetailPage: React.FC = () => {
  const { id } = useParams(); // Lấy id từ URL params
  const [course, setCourse] = useState<CourseDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id) return;
      try {
        const response = await courseApi.getCourseDetail(id as string);
        if (response.status === "Successfully") {
          setCourse(response.message);
        } else {
          setError(response.message || "Không thể tải chi tiết khóa học.");
        }
      } catch (err: any) {
        setError(err.message || "Vui lòng đăng nhập để xem chi tiết khóa học!");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
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

  return course ? <CourseDetail courses={course} /> : null;
};

export default CourseDetailPage;
