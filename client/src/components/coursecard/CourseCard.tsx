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
import {
  ShoppingCart as ShoppingCartIcon,
  Edit as EditIcon,
  Star as StarIcon,
  StarHalf as StarHalfIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
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

// Hàm để render rating sao
const renderRating = (ratingScore: number) => {
  const fullStars = Math.floor(ratingScore);
  const halfStars = ratingScore % 1 !== 0 ? 1 : 0; // Kiểm tra xem có sao nửa nào không
  const emptyStars = 5 - fullStars - halfStars; // Số sao rỗng còn lại

  const stars = [];

  // Thêm các sao đầy đủ
  for (let i = 0; i < fullStars; i++) {
    stars.push(<StarIcon key={`full-${i}`} sx={{ color: "#FFD700" }} />);
  }

  // Thêm sao nửa
  if (halfStars === 1) {
    stars.push(<StarHalfIcon key="half" sx={{ color: "#FFD700" }} />);
  }

  // Thêm các sao rỗng
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<StarBorderIcon key={`empty-${i}`} sx={{ color: "#FFD700" }} />);
  }

  return stars;
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

  const handleEditCourse = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/course/edit/${course.id}`);
  };

  useEffect(() => {
    const fetchedToken = getAuthToken();
    setToken(fetchedToken);
  }, []);

  const handleAddToCart = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!token) {
        notifyError("Vui lòng đăng nhập trước khi thêm vào giỏ!");
        return;
      }

      setIsAddingToCart(true);
      try {
        await cartApi.addToCart(course.id, token);
        notifySuccess("Đã thêm vào giỏ hàng thành công!");
        setCartCount((prevCount) => prevCount + 1);
      } catch (error) {
        notifyError("Có lỗi xảy ra khi thêm khóa học vào giỏ!");
      } finally {
        setIsAddingToCart(false);
      }
    },
    [token, course.id, notifySuccess, notifyError, setCartCount]
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
        cursor: "pointer",
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

      {showEdit && (
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            ":hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
          }}
          onClick={handleEditCourse}
        >
          <EditIcon />
        </IconButton>
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

        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap" }}>
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

        <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
          Đánh giá: {renderRating(course.ratingScore)}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {course.enrollment} người đã tham gia
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        {course.sale > 0 ? (
          <>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: "line-through",
                  fontSize: "0.9rem",
                }}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(course.price)}
              </Typography>
              <Box
                sx={{
                  ml: 1,
                  backgroundColor: "error.main",
                  color: "white",
                  borderRadius: 1,
                  px: 1,
                  py: 0.25,
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                -{Math.round((1 - course.salePrice / course.price) * 100)}%
              </Box>
            </Box>

            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(course.salePrice)}
            </Typography>
          </>
        ) : (
          <Typography
            variant="h6"
            color="text.primary"
            fontWeight="bold"
            sx={{
              fontSize: "1.25rem",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(course.price)}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              fontWeight: "bold",
              ":hover": {
                boxShadow: 6,
                transform: "scale(1.05)",
                backgroundColor: "#1976d2",
              },
              flex: 1,
            }}
            onClick={() => router.push(`/course/${course.id}`)}
          >
            Xem Chi Tiết
          </Button>
          {!course.isMyLearning && (
            <Button
              variant="outlined"
              color="secondary"
              sx={{
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
                flex: 1,
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
              Thêm vào giỏ
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default CourseCard;
