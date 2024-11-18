"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { useAppContext } from "@/context/AppContext";
import { useToastNotification } from "@/hook/useToastNotification";
import { useRouter } from "next/navigation"; // Đảm bảo bạn đã cài đặt router từ Next.js
import { myLearningApi } from "@/server/MyLearning";

interface Course {
  courseId: string;
  title: string;
  price: number;
  salePrice?: number;
  description: string;
  thumbnail: string;
  level: string;
}

const getLevelLabel = (level: string) => {
  switch (level) {
    case "Beginner":
      return "Người mới";
    case "Intermediate":
      return "Trung cấp";
    case "Advanced":
      return "Nâng cao";
    default:
      return "Chưa xác định";
  }
};

const MyLearning: React.FC = () => {
  const { sessionToken } = useAppContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchParam, setSearchParam] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useToastNotification();
  const router = useRouter(); // Sử dụng router để điều hướng

  useEffect(() => {
    const fetchMyLearnings = async () => {
      setIsLoading(true);
      try {
        if (!sessionToken) {
          setError("Vui lòng đăng nhập lại.");
          return;
        }

        const response = await myLearningApi.getMyLearnings(
          { searchParam },
          sessionToken
        );

        if (response.status !== "Successfully") {
          throw new Error("Lỗi khi lấy dữ liệu.");
        }

        setCourses(response.message);
        setFilteredCourses(response.message); // Set initial courses
      } catch (err: any) {
        console.error("Error fetching my learnings:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
        notifyError("Lỗi khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyLearnings();
  }, [sessionToken, searchParam]); // Trigger fetching data when searchParam changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter courses based on searchParam
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchParam.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleStartCourse = (courseId: string) => {
    router.push(`/course/${courseId}/player`);
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "60vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Các Khóa Học Của Tôi
      </Typography>

      {/* Form tìm kiếm */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: "flex", mb: 4, gap: 2 }}
      >
        <TextField
          label="Tìm kiếm khóa học"
          variant="outlined"
          fullWidth
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Tìm kiếm
        </Button>
      </Box>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Hiển thị loading */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredCourses.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Không tìm thấy khóa học nào phù hợp.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.courseId}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  boxShadow: 3,
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={course.thumbnail}
                  alt={course.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {course.description.length > 100
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={`Cấp độ: ${getLevelLabel(course.level)}`}
                      variant="outlined"
                      sx={{
                        mr: 1,
                        mb: 1,
                        fontSize: "0.8rem",
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  </Box>
                </CardContent>

                {/* Nút bắt đầu khóa học */}
                <Box sx={{ padding: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleStartCourse(course.courseId)}
                  >
                    Bắt đầu khóa học
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyLearning;
