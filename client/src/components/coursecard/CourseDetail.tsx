"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  TextField,
} from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/navigation";
import { CourseDetail as CourseDetailType } from "@/interfaces/CourseDetail";
import Rating from "@mui/material/Rating";
import { useToastNotification } from "@/hook/useToastNotification";
import { getAuthToken } from "@/utils/auth";
import { useCart } from "@/context/CartContext";
import { cartApi } from "@/server/Cart";
import { courseApi } from "@/server/Cource";

interface CourseDetailProps {
  courses: {
    course: CourseDetailType;
    isValidStudent: boolean;
  };
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
  const halfStars = ratingScore % 1 !== 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<CheckIcon key={`full-${i}`} sx={{ color: "#FFD700" }} />);
  }

  if (halfStars === 1) {
    stars.push(<CheckIcon key="half" sx={{ color: "#FFD700" }} />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<CheckIcon key={`empty-${i}`} sx={{ color: "#C0C0C0" }} />);
  }

  return stars;
};

const CourseDetail: React.FC<CourseDetailProps> = ({ courses }) => {
  const { course, isValidStudent } = courses;
  const router = useRouter();
  const [newComment, setNewComment] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { cartCount, setCartCount } = useCart();
  const { notifySuccess, notifyError } = useToastNotification();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const commentsPerPage = 5;

  const totalComments = course.rating.length;
  const totalPages = Math.ceil(totalComments / commentsPerPage);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = course.rating.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleStartCourse = () => {
    router.push(`/course/${course.id}/player`);
  };

  useEffect(() => {
    const fetchedToken = getAuthToken();
    setToken(fetchedToken);
  }, []);

  const handleEnroll = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!token) {
        notifyError("Vui lòng đăng nhập trước khi thêm vào giỏ!");
        return;
      }

      setIsAddingToCart(true);
      try {
        const res = await cartApi.addToCart(course.id, token);
        notifySuccess("Đã thêm vào giỏ hàng thành công!");
        setCartCount(res.message.total);
      } catch (error) {
        notifyError("Có lỗi xảy ra khi thêm khóa học vào giỏ!");
      } finally {
        setIsAddingToCart(false);
      }
    },
    [token, course.id, notifySuccess, notifyError, setCartCount]
  );

  const handleLectureClick = (lectureId: string) => {
    // Xử lý khi người dùng click vào bài giảng (có thể điều hướng đến video hoặc nội dung bài giảng)
    router.push(`/course/${course.id}/lecture/${lectureId}`);
  };

  const handleSubmitComment = async () => {
    // Kiểm tra nếu đánh giá hoặc nhận xét không hợp lệ
    if (newRating <= 0 || newComment.trim() === "") {
      notifyInfo("Vui lòng đánh giá và nhập nhận xét.");
      return;
    }

    const data = {
      score: newRating,
      content: newComment.trim(),
    };

    try {
      const response = await courseApi.ratingCourse(
        course.id,
        data,
        token || ""
      );

      if (response?.status === "Successfully" && response?.message) {
        notifySuccess(
          response.message || "Cảm ơn bạn đã đánh giá khóa học này!"
        );

        // Reset form
        setNewRating(0);
        setNewComment("");

        // Kiểm tra router.asPath có hợp lệ hay không trước khi gọi router.replace
        if (router.asPath) {
          router.replace(router.asPath); // Điều hướng lại trang hiện tại
        } else {
          router.push("/all-courses/");
        }
      } else {
        throw new Error(response?.message || "Gửi đánh giá không thành công.");
      }
    } catch (error: any) {
      notifyError(
        error?.message || "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!"
      );
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: "1200px", margin: "auto" }}>
      {/* Header Section */}
      <Grid container spacing={4} alignItems="center">
        {/* Thumbnail */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              overflow: "hidden",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <img
              src={course.thumbnail}
              alt={course.title}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </Paper>
        </Grid>

        {/* Course Info */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {course.description}
          </Typography>

          {/* Price and Details */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            {course.sale > 0 ? (
              <>
                {/* Giá cũ */}
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
                  {/* Nhãn giảm giá */}
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

                {/* Giá mới */}
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
                }).format(course.price)}
              </Typography>
            )}
          </Box>

          {/* Thông tin Danh mục, Cấp độ, Ngôn ngữ và Số người tham gia */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mt: 2,
              alignItems: "center",
            }}
          >
            <Chip
              label={`Danh mục: ${course.category}`}
              color="primary"
              sx={{ fontSize: "0.9rem" }}
            />
            <Chip
              label={`Cấp độ: ${getLevelLabel(course.level)}`}
              color="secondary"
              sx={{ fontSize: "0.9rem" }}
            />
            <Chip
              label={`Ngôn ngữ: ${course.language}`}
              color="success"
              sx={{ fontSize: "0.9rem" }}
            />
            <Chip
              label={`Người tham gia: ${course.enrollment}`}
              color="info"
              sx={{ fontSize: "0.9rem" }}
            />
          </Box>

          {/* Instructor */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
            <Avatar
              src={course.instructor.avt}
              alt={course.instructor.fullName}
              sx={{ mr: 2 }}
            >
              {course.instructor.fullName.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1">
              Chuyên gia:{" "}
              <Typography
                component="span"
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
              >
                {course.instructor.fullName}
              </Typography>
            </Typography>
          </Box>

          {/* Enrollment Buttons */}
          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            {isValidStudent ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleStartCourse}
                startIcon={<PlayArrowIcon />}
              >
                Bắt đầu khóa học
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleEnroll}
                startIcon={
                  isAddingToCart ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ShoppingCartIcon />
                  )
                }
                disabled={isAddingToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 6 }} />

      {/* Content and Lectures */}
      <Grid container spacing={4}>
        {/* Sidebar: Sections and Lectures */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Nội dung khóa học
            </Typography>
            {course.content.map((section, sectionIndex) => (
              <Accordion key={sectionIndex} sx={{ mb: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-content-${sectionIndex}`}
                  id={`panel-header-${sectionIndex}`}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "primary.main" }}
                  >
                    {`Phần ${sectionIndex + 1}: ${section.sectionTitle}`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {section.lectures.map(
                      (lecture: any, lectureIndex: number) => (
                        <ListItem
                          button
                          key={lectureIndex}
                          onClick={() => handleLectureClick(lecture.id)}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <ListItemIcon>
                            {lecture.type === "video" ? (
                              <PlayCircleOutlineIcon color="primary" />
                            ) : (
                              <DescriptionIcon color="action" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={lecture.title}
                            secondary={lecture.duration}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>

        {/* Main Content: What You Will Learn and Requirements */}
        <Grid item xs={12} md={8}>
          {/* Bạn sẽ học được gì */}
          <Accordion elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="learn-content"
              id="learn-header"
            >
              <Typography variant="h5">Bạn sẽ học được gì</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {course.whatYouWillLearn.map((item: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Yêu cầu */}
          <Accordion elevation={3} sx={{ borderRadius: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="requirements-content"
              id="requirements-header"
            >
              <Typography variant="h5">Yêu cầu</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {course.requirements.map((req: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Rating and Comments */}
          <Box>
            {isValidStudent && (
              <Box
                sx={{
                  mb: 3,
                  padding: 2,
                  backgroundColor: "#f0f0f06a",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  align={"center"}
                  sx={{
                    mb: 3,
                    padding: 2,
                    backgroundColor: "#c9c9c992",
                    borderRadius: 2,
                  }}
                >
                  Đánh giá của bạn
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    Đánh giá sao:
                  </Typography>
                  <Rating
                    name="rating"
                    value={newRating}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setNewRating(newValue || 0);
                    }}
                  />
                </Box>
                <TextField
                  label="Nhận xét của bạn"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitComment}
                >
                  Gửi Đánh Giá
                </Button>
              </Box>
            )}

            {/* Hiển thị các bình luận hiện tại */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" gutterBottom align={"center"}>
                Nhận xét
              </Typography>
              {currentComments.length > 0 ? (
                currentComments.map((r, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      padding: 2,
                      backgroundColor: "#f0f0f06a",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        src={r.user.avt}
                        alt={r.user.fullName}
                        sx={{ mr: 2 }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", mr: 1 }}
                      >
                        {r.user.fullName}
                      </Typography>
                      <Rating value={r.score} readOnly />
                    </Box>
                    {/* Làm nổi bật nội dung nhận xét */}
                    <Box
                      sx={{
                        backgroundColor: "#f0f0f0",
                        padding: 2,
                        borderRadius: 2,
                        mt: 1,
                        borderLeft: "4px solid #1976d2",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "medium",
                          color: "#333",
                          fontSize: "1rem",
                        }}
                      >
                        {r.content}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Chưa có bình luận nào.
                </Typography>
              )}

              {/* Phân trang */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handleChangePage}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetail;
