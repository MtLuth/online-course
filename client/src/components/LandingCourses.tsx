"use client";

import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Pagination,
  Stack,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { courseApi } from "@/server/Cource"; // Sửa lại đường dẫn nếu cần
import { getAuthToken } from "@/utils/auth";
import { jwtDecode } from "jwt-decode";
import { useToastNotification } from "@/hook/useToastNotification";
import CourseCard from "./coursecard/CourseCard";
import Iconify from "./iconify";

const LandingCourses: React.FC = () => {
  const router = useRouter();
  const token = getAuthToken();
  const [uid, setUid] = useState<string | undefined>(undefined);

  const [courses, setCourses] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { notifyError } = useToastNotification();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUid(decoded.user_id);
      } catch (error) {
        console.error("Invalid token format:", error);
        setUid(undefined);
      }
    } else {
      setUid(undefined);
    }
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await courseApi.getAllCourses(
          1,
          6,
          "",
          "",
          undefined,
          "asc",
          uid
        );

        if (response.status === "Successfully") {
          setCourses(response.message.results);
        } else {
          setError(response.message || "Không thể tải danh sách khóa học.");
        }
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        setError(error.message || "Có lỗi xảy ra khi tải danh sách khóa học.");
        notifyError(
          error.message || "Có lỗi xảy ra khi tải danh sách khóa học."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!Array.isArray(courses) || courses.length === 0) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" align="center">
          Không có khóa học nào để hiển thị.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          padding: 2,
          backgroundColor: "#c5c5c573",
          borderRadius: 2,
        }}
      >
        Khóa Học Nổi Bật
      </Typography>

      <Grid
        container
        spacing={1}
        justifyContent="center"
        sx={{ minWidth: 1366 }}
      >
        {courses.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/all-courses")}
          endIcon={<Iconify icon="carbon:play" />}
        >
          Xem Tất Cả Khóa Học
        </Button>
      </Stack>
    </Box>
  );
};

export default LandingCourses;
