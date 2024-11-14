// components/coursecard/CourseCard.tsx

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
  CardMedia,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { CourseDetail } from "@/interfaces/CourseDetail";

interface CourseCardProps {
  course: CourseDetail;
  showEdit?: boolean; // Controls visibility of edit button
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  showEdit = false,
}) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/course/${course.id}`);
  };

  const handleEditCourse = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering view details
    router.push(`/course/edit/${course.id}`);
  };

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
        "&:hover": {
          boxShadow: 6,
        },
      }}
      onClick={handleViewDetails}
    >
      {/* Thumbnail Image */}
      {course.thumbnail && (
        <CardMedia
          component="img"
          height="140"
          image={course.thumbnail}
          alt={course.title || "Course Thumbnail"}
        />
      )}

      {/* Edit Button */}
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
