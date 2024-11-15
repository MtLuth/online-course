import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/auth";
import { CourseDetail } from "@/model/CourseDetail.model";
import { cartApi } from "@/server/Cart";
import { useToastNotification } from "@/hook/useToastNotification";
import { useCart } from "@/context/CartContext"; // Import CartContext

interface CourseCardProps {
  course: CourseDetail;
  showEdit?: boolean;
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

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showEdit = false,
}) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { cartCount, setCartCount } = useCart();
  const { notifySuccess, notifyError } = useToastNotification();

  useEffect(() => {
    const fetchedToken = getAuthToken();
    setToken(fetchedToken);
  }, []);

  const handleAddToCart = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation(); // Ngăn chặn sự kiện click tiếp tục gây ra điều hướng
      if (!token) {
        notifySuccess("Vui lòng đăng nhập trước khi thêm vào giỏ!");
        return;
      }

      setIsAddingToCart(true);
      try {
        await cartApi.addToCart(course.id, token);
        notifySuccess("Đã thêm vào giỏ hàng Thành Công!");

        // Sau khi thêm vào giỏ hàng thành công, cập nhật lại số lượng giỏ hàng
        setCartCount((prevCount) => prevCount + 1); // Giả sử thêm 1 khóa học vào giỏ
      } catch (error) {
        notifyError("Có lỗi xảy ra khi thêm khóa học vào giỏ!");
      } finally {
        setIsAddingToCart(false);
      }
    },
    [token, course.id, notifySuccess, notifyError, setCartCount] // Thêm setCartCount vào dependency array
  );

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        "&:hover": {
          boxShadow: 6,
        },
      }}
      onClick={() => router.push(`/course/${course.id}`)}
    >
      {course.thumbnail && (
        <CardMedia
          component="img"
          height="180"
          image={course.thumbnail}
          alt={course.title || "Course Thumbnail"}
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {course.description.length > 100
            ? `${course.description.substring(0, 100)}...`
            : course.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Danh mục: ${course.category}`}
            variant="outlined"
            sx={{
              mr: 1,
              mb: 1,
              fontSize: "0.8rem",
              backgroundColor: "#f0f0f0",
            }}
          />
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

      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="h6" color="text.primary" fontWeight="bold">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(course.price)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 1,
              borderRadius: 2,
              boxShadow: 3,
              fontWeight: "bold",
              ":hover": {
                boxShadow: 6,
                transform: "scale(1.05)",
                backgroundColor: "#1976d2",
              },
            }}
            onClick={() => router.push(`/course/${course.id}`)}
          >
            Xem Chi Tiết
          </Button>

          {token && !showEdit && (
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                mt: 1,
                borderRadius: 2,
                boxShadow: 3,
                fontWeight: "bold",
                marginLeft: 1,
                ":hover": {
                  color: "#fff",
                  boxShadow: 6,
                  transform: "scale(1.05)",
                  backgroundColor: "#1976d2",
                },
              }}
              onClick={handleAddToCart}
              startIcon={
                isAddingToCart ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ShoppingCartIcon />
                )
              }
            >
              {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default CourseCard;
