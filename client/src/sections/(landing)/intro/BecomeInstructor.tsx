"use client";
import React from "react";
import {
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardMedia,
  Avatar,
} from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/system";

// Định dạng lại một số phần tử để tạo ra sự khác biệt
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f7f7f7",
  borderRadius: "8px",
}));

const BecomeInstructor = () => {
  return (
    <Container>
      {/* Tiêu đề và phần giới thiệu */}
      <Box sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Trở Thành Chuyên Gia và Thay Đổi Cuộc Đời
        </Typography>
        <Typography
          variant="h5"
          paragraph
          sx={{ maxWidth: "800px", margin: "0 auto" }}
        >
          Hãy cùng chúng tôi giảng dạy và thay đổi cuộc sống, bao gồm cả chính
          bạn!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          component={Link}
          href="/become-instructor"
        >
          Trở Thành Chuyên Gia
        </Button>
      </Box>

      {/* Các lý do nên gia nhập */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Hàng loạt lý do để bắt đầu
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Giảng dạy theo cách của bạn:</strong> Đăng tải khóa học
              theo ý muốn của bạn, với quyền kiểm soát toàn bộ nội dung.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Truyền cảm hứng cho học viên:</strong> Dạy những gì bạn
              biết và giúp học viên khám phá đam mê, học thêm kỹ năng mới, và
              phát triển sự nghiệp.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Được thưởng xứng đáng:</strong> Mở rộng mạng lưới chuyên
              nghiệp, xây dựng chuyên môn và kiếm tiền từ mỗi học viên tham gia
              khóa học.
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Các testimonial từ người giảng dạy */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={3}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Chia sẻ từ các giảng viên
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Avatar
                  alt="Giảng viên 1"
                  src="/images/teacher1.jpg"
                  sx={{ width: 56, height: 56 }}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" paragraph>
                  "Được giảng dạy và chia sẻ kiến thức là niềm vui lớn của tôi.
                  Đây là cơ hội tuyệt vời để phát triển bản thân và sự nghiệp!"
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  – Nguyễn Văn A, Giảng viên
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Avatar
                  alt="Giảng viên 2"
                  src="/images/teacher2.jpg"
                  sx={{ width: 56, height: 56 }}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1" paragraph>
                  "Là một chuyên gia trong lĩnh vực của mình, tôi đã học hỏi
                  được rất nhiều khi giảng dạy cho các học viên trên nền tảng
                  này."
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                  – Trần Thị B, Giảng viên
                </Typography>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Các khóa học nổi bật */}
      <Box sx={{ textAlign: "center", my: 5 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Các Khóa Học Nổi Bật
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://i.postimg.cc/Bb5stQX0/Screenshot-2024-11-15-141350.png"
                alt="Khóa học 1"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Lập Trình Web Cơ Bản
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khóa học này sẽ giúp bạn nắm vững các kiến thức cơ bản trong
                  việc xây dựng một trang web từ đầu.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://i.postimg.cc/Bb5stQX0/Screenshot-2024-11-15-141350.png"
                alt="Khóa học 2"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Marketing Trực Tuyến
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khám phá các chiến lược marketing trực tuyến hiệu quả và làm
                  thế nào để triển khai chúng.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://i.postimg.cc/Bb5stQX0/Screenshot-2024-11-15-141350.png"
                alt="Khóa học 3"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Thiết Kế Đồ Họa Cơ Bản
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khóa học này sẽ cung cấp cho bạn những kiến thức cơ bản về
                  thiết kế đồ họa và phần mềm sử dụng trong thiết kế.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BecomeInstructor;
