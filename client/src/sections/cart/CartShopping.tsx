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
import { useCart } from "@/context/CartContext";
import { useToastNotification } from "@/hook/useToastNotification";
import { purchaseApi } from "@/server/Purchase";
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
interface Course {
  id: string;
  title: string;
  instructor: string;
  level: string;
  price: number;
  thumbnail: string;
  createdAt: number;
}

export default function CartShopping() {
  const { sessionToken } = useAppContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { notifySuccess, notifyError } = useToastNotification();
  const { setCartCount } = useCart();

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
          notifyError("Lỗi khi tải dữ liệu giỏ hàng: " + errorText);
          throw new Error("Lỗi khi tải dữ liệu giỏ hàng");
        }

        const data = await response.json();
        if (!data.message || !Array.isArray(data.message.courses)) {
          throw new Error("Dữ liệu giỏ hàng không hợp lệ");
        }

        const coursesArray: Course[] = data.message.courses.map((item: any) => {
          const [id, courseData] = Object.entries(item)[0];
          return {
            id,
            title: courseData.course.title,
            instructor: courseData.course.instructor,
            level: courseData.course.level,
            price: courseData.course.price,
            thumbnail: courseData.course.thumbnail,
            createdAt: courseData.createdAt,
          };
        });

        setCourses(coursesArray);
        setSelectedCourses(coursesArray.map((course) => course.id));
        localStorage.setItem("cartCount", coursesArray.length.toString());
        setCartCount(coursesArray.length);
      } catch (error: any) {
        console.error("Error fetching cart data:", error);
        setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [sessionToken, router, setCartCount]);

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
        notifyError("Lỗi khi xóa khóa học: " + errorText);
        setError("Không thể xóa khóa học. Vui lòng thử lại.");
        return;
      }

      setCourses((prevCourses) => {
        const updatedCourses = prevCourses.filter(
          (course) => course.id !== courseId
        );
        localStorage.setItem("cartCount", updatedCourses.length.toString());
        setCartCount(updatedCourses.length);
        return updatedCourses;
      });

      setSelectedCourses((prevSelected) =>
        prevSelected.filter((id) => id !== courseId)
      );

      notifySuccess("Khóa học đã được xóa thành công.");
    } catch (error: any) {
      console.error("Error deleting course:", error);
      setError("Đã xảy ra lỗi khi xóa khóa học. Vui lòng thử lại sau.");
    }
  };

  const total = courses
    .filter((course) => selectedCourses.includes(course.id))
    .reduce((sum, course) => sum + course.price, 0);

  const handleCheckout = async () => {
    try {
      const selectedCoursesData = courses
        .filter((course) => selectedCourses.includes(course.id))
        .map((course) => course.id);

      const purchaseData = { courses: selectedCoursesData };

      const response = await purchaseApi.purchaseCourse(
        purchaseData,
        sessionToken
      );

      if (response.status === "Successfully") {
        const paymentLink = response.message.paymentLink.checkoutUrl;
        // Redirect user to the payment URL
        window.location.href = paymentLink;
      } else {
        throw new Error("Lỗi khi tạo đơn hàng");
      }
    } catch (error: any) {
      console.error("Error during checkout:", error);
      setError("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
      notifyError("Lỗi khi thanh toán.");
    }
  };

  // Function to format the createdAt timestamp to Vietnamese date string
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  // Function to apply coupon
  const handleApplyCoupon = async () => {
    try {
      if (!coupon.trim()) {
        notifyError("Vui lòng nhập mã khuyến mãi.");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/coupon/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ coupon }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "Successfully") {
        notifySuccess("Mã khuyến mãi đã được áp dụng thành công.");
      } else {
        notifyError("Mã khuyến mãi không hợp lệ hoặc đã được sử dụng.");
      }
    } catch (error: any) {
      console.error("Error applying coupon:", error);
      notifyError("Đã xảy ra lỗi khi áp dụng mã khuyến mãi.");
    }
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
              Có {selectedCourses.length} khóa học đã được chọn
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
                <Box sx={{ position: "relative", width: 80, height: 80 }}>
                  <Image
                    src={
                      course.thumbnail ||
                      "https://i.postimg.cc/Bb5stQX0/Screenshot-2024-11-15-141350.png"
                    }
                    alt={`Hình ảnh của ${course.title}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </Box>

                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giảng viên: {course.instructor}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Cấp độ: {getLevelLabel(course.level)}
                  </Typography>
                  <Typography variant="body2">
                    Giá: {course.price.toLocaleString()}₫
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Thêm vào giỏ hàng vào lúc: {formatDate(course.createdAt)}
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
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleApplyCoupon}
                >
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
