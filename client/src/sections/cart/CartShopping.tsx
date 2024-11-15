"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  Divider,
  IconButton,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

interface Course {
  id: string;
  title: string;
  instructor: string;
  level: string;
  price: number;
  createdAt: number;
}

interface ApiResponse {
  status: string;
  message: {
    courses: {
      [key: string]: {
        course: {
          title: string;
          instructor: string;
          level: string;
          price: number;
        };
        createdAt: number;
      };
    };
    total: number;
  };
}

export default function CartShopping() {
  const { sessionToken } = useAppContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        if (!sessionToken) {
          setError("Vui lòng đăng nhập lại.");
          router.push("/login");
          return;
        }

        const response = await fetch("http://localhost:8080/api/v1/cart", {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Lỗi khi tải dữ liệu giỏ hàng:", errorText);
          throw new Error("Lỗi khi tải dữ liệu giỏ hàng");
        }

        const data: ApiResponse = await response.json();
        console.log(data.message.courses);
        const coursesArray = Object.entries(data.message.courses).map(
          ([id, courseData]) => ({
            id,
            title: courseData.course.title,
            instructor: courseData.course.instructor,
            level: courseData.course.level,
            price: courseData.course.price,
            createdAt: courseData.createdAt,
          })
        );

        setCourses(coursesArray);
        setSelectedCourses(coursesArray.map((course) => course.id));
        localStorage.setItem("cartCount", coursesArray.length.toString());
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [sessionToken, router]);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(courseId)
        ? prevSelected.filter((id) => id !== courseId)
        : [...prevSelected, courseId]
    );
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/cart/${courseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Lỗi khi xóa khóa học:", errorText);
        setError("Không thể xóa khóa học. Vui lòng thử lại.");
        return;
      }

      setCourses((prevCourses) => {
        const updatedCourses = prevCourses.filter(
          (course) => course.id !== courseId
        );

        localStorage.setItem("cartCount", updatedCourses.length.toString());

        return updatedCourses;
      });

      setSelectedCourses((prevSelected) =>
        prevSelected.filter((id) => id !== courseId)
      );

      console.log("Khóa học đã được xóa thành công.");
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Đã xảy ra lỗi khi xóa khóa học. Vui lòng thử lại sau.");
    }
  };

  const total = courses
    .filter((course) => selectedCourses.includes(course.id))
    .reduce((sum, course) => sum + course.price, 0);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: courses.length === 0 ? "center" : "flex-start",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Giỏ Hàng
      </Typography>

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            padding: 3,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            maxWidth: 600,
            width: "100%",
          }}
        >
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            Giỏ hàng của bạn hiện chưa có khóa học nào. Hãy khám phá thêm để tìm
            khóa học phù hợp!
          </Typography>
          <Button variant="contained" color="primary" href="/" sx={{ mt: 3 }}>
            Khám phá thêm
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Có {selectedCourses.length} khóa học trong giỏ hàng
            </Typography>
            {courses.map((course) => (
              <Box
                key={course.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  border: "1px solid #e0e0e0",
                  padding: 2,
                  borderRadius: 1,
                }}
              >
                <Checkbox
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleSelectCourse(course.id)}
                />
                <Image
                  src={course.thumbnail ? course.thumbnail : ""}
                  alt={`Image of ${course.title}`}
                  width={80}
                  height={80}
                />

                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Instructor: {course.instructor}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Level: {course.level}
                  </Typography>
                  <Typography variant="body2">
                    Price: {course.price.toLocaleString()}₫
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleDeleteCourse(course.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Grid>

          {courses.length > 0 && (
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Tổng cộng:
              </Typography>
              <Box
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  padding: 2,
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  {total.toLocaleString()}₫
                </Typography>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleCheckout}
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={selectedCourses.length === 0}
                >
                  Thanh Toán
                </Button>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Khuyến mãi
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Nhập mã"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="secondary" fullWidth>
                  Áp dụng
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
