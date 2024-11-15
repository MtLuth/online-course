"use client";

import React from "react";
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
  Card,
  CardContent,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useRouter } from "next/navigation";
import { CourseDetail as CourseDetailType } from "@/interfaces/CourseDetail";

interface CourseDetailProps {
  course: CourseDetailType;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  const router = useRouter();
  const handleStartCourse = () => {
    router.push(`/course/${course.id}/player`);
  };

  const handleEnroll = () => {
    alert("Bạn đã đăng ký khóa học!");
  };

  const handleLectureClick = (lectureId: string) => {
    alert(`Chọn bài giảng: ${lectureId}`);
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
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(course.price)}
            </Typography>
            <Chip label={`Danh mục: ${course.category}`} color="primary" />
            <Chip label={`Cấp độ: ${course.level}`} color="secondary" />
          </Box>

          {/* Instructor */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
            <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
              {course.instructor.fullName.charAt(0)}
            </Avatar>
            <Typography variant="subtitle1">
              Giảng viên:{" "}
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
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleEnroll}
            >
              Đăng ký Ngay
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={handleStartCourse}
              startIcon={<PlayArrowIcon />}
            >
              Bắt đầu khóa học
            </Button>
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
              <Box key={sectionIndex} sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {`Phần ${sectionIndex + 1}: ${section.sectionTitle}`}
                </Typography>
                <List>
                  {section.lectures.map(
                    (lecture: any, lectureIndex: number) => (
                      <ListItem
                        button
                        key={lectureIndex}
                        onClick={() => handleLectureClick(lecture.id)}
                      >
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={lecture.title}
                          secondary={lecture.duration}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Main Content: What You Will Learn and Requirements */}
        <Grid item xs={12} md={8}>
          <Card elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Bạn sẽ học được gì
              </Typography>
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
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Yêu cầu
              </Typography>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetail;
