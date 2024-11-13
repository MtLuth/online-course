"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material"; // Import biểu tượng chỉnh sửa
import { useRouter } from "next/navigation";
import { Course } from "@/model/Course.model";

interface CourseCardProps {
  course: Course;
  onEdit?: (courseId: string) => void; // Optional callback cho hành động chỉnh sửa
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/course/${course.id}`);
  };

  const handleEditCourse = (event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn chặn sự kiện lan sang nút "Xem Chi Tiết"
    if (onEdit) {
      onEdit(course.id); // Gọi callback chỉnh sửa nếu được cung cấp
    } else {
      router.push(`/course/edit/${course.id}`); // Điều hướng mặc định đến trang chỉnh sửa
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative", // Để định vị nút chỉnh sửa
      }}
    >
      {/* Nút chỉnh sửa ở góc trên bên phải */}
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: "background.paper",
          ":hover": { backgroundColor: "grey.300" },
        }}
        onClick={handleEditCourse}
      >
        <EditIcon />
      </IconButton>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {course.description.length > 100
            ? `${course.description.substring(0, 100)}...`
            : course.description}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Danh mục: ${course.category}`}
            variant="outlined"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            label={`Cấp độ: ${course.level}`}
            variant="outlined"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            label={course.isPublished ? "Đã xuất bản" : "Chưa xuất bản"}
            color={course.isPublished ? "success" : "warning"}
          />
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="h6" color="text.primary">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(course.price)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={handleViewDetails}
        >
          Xem Chi Tiết
        </Button>
      </Box>
    </Card>
  );
};

export default CourseCard;
