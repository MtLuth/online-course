"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CourseDetail as CourseDetailType } from "@/model/CourseDetail.model";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { courseApi } from "@/server/Cource";
import CoursePlayer from "@/components/courseplayer/CoursePlayer";
import { useRouter } from "next/navigation";

const CoursePlayerPage: React.FC = () => {
  const { id } = useParams(); // Lấy id từ URL params
  const [course, setCourse] = useState<CourseDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentLectureIndex, setCurrentLectureIndex] = useState<{
    section: number;
    lecture: number;
  }>({ section: 0, lecture: 0 });

  const router = useRouter(); // Dùng router để điều hướng khi cần

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id) return;
      try {
        const response = await courseApi.getCourseDetail(id as string);

        if (response.status === "Successfully") {
          setCourse(response.message.course);

          if (!response.message.isValidStudent) {
            // Nếu người dùng chưa mua khóa học, hiển thị thông báo và chuyển hướng đến trang thanh toán
            setError(
              "Bạn chưa mua khóa học này. Vui lòng mua khóa học này để xem khóa học này"
            );
          }
        } else {
          setError(response.message || "Không thể tải chi tiết khóa học.");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải chi tiết khóa học.");
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
        {error ===
          "Bạn chưa mua khóa học này. Vui lòng mua khóa học này để xem khóa học này" && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/payment/${id}`)}
            >
              Thanh Toán
            </Button>
          </Box>
        )}
      </Box>
    );
  }

  return course ? (
    <CoursePlayer
      course={course}
      currentLectureIndex={currentLectureIndex}
      setCurrentLectureIndex={setCurrentLectureIndex}
    />
  ) : null;
};

export default CoursePlayerPage;
