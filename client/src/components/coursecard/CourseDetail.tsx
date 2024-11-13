// components/CourseDetail.tsx
import React from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { CourseDetail as CourseDetailType } from "@/interfaces/CourseDetail";

interface CourseDetailProps {
  course: CourseDetailType;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  return (
    <Box sx={{ padding: 4 }}>
      {/* Hình ảnh bìa và Thông tin cơ bản */}
      <Grid container spacing={4}>
        {/* Hình ảnh bìa */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={course.thumbnail}
              alt={course.title}
            />
          </Card>
        </Grid>

        {/* Thông tin cơ bản */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {course.description}
          </Typography>

          {/* Giá và Danh mục */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Typography variant="h5" color="primary" sx={{ mr: 2 }}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(course.price)}
            </Typography>
            <Chip
              label={`Danh mục: ${course.category}`}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip
              label={`Cấp độ: ${course.level}`}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip label={`Ngôn ngữ: ${course.language}`} variant="outlined" />
          </Box>

          {/* Giảng viên */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              Giảng viên:
            </Typography>
            <Chip label={course.instructor.fullName} color="secondary" />
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Yêu cầu */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Yêu cầu
        </Typography>
        <List>
          {course.requirements.map((req, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={req} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Những gì bạn sẽ học */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Bạn sẽ học được gì
        </Typography>
        <List>
          {course.whatYouWillLearn.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Nội dung khóa học */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Nội dung khóa học
        </Typography>
        {course.content.map((section, sectionIndex) => (
          <Paper key={sectionIndex} sx={{ p: 2, mb: 2 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              {`Phần ${sectionIndex + 1}: ${section.sectionTitle}`}
            </Typography>
            {section.lectures.map((lecture, lectureIndex) => (
              <Box key={lectureIndex} sx={{ mb: 2, pl: 2 }}>
                <Typography variant="subtitle1">
                  {`Bài giảng ${lectureIndex + 1}: ${lecture.title} (${
                    lecture.duration
                  })`}
                </Typography>
                {lecture.type === "video" && (
                  <Box sx={{ mt: 1 }}>
                    <video width="100%" height="300" controls>
                      <source src={lecture.videoUrl} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video tag.
                    </video>
                  </Box>
                )}
                {lecture.type === "article" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {lecture.videoUrl}
                  </Typography>
                )}
                {/* Tài nguyên */}
                {lecture.resources && lecture.resources.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">Tài nguyên:</Typography>
                    <List>
                      {lecture.resources.map((resource, resIndex) => (
                        <ListItem key={resIndex}>
                          <ListItemIcon>
                            <CheckIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={resource.title}
                            secondary={
                              <a
                                href={resource.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {resource.fileUrl}
                              </a>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        ))}
      </Box>

      {/* Nút Hành động */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" color="primary" size="large">
          Đăng ký Ngay
        </Button>
      </Box>
    </Box>
  );
};

export default CourseDetail;
