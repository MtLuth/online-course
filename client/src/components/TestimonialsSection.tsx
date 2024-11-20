"use client";

import React from "react";
import { Box, Typography, Grid, Paper, Avatar } from "@mui/material";
import { styled } from "@mui/system";

const TESTIMONIALS = [
  {
    name: "Nguyễn Văn A",
    avatarUrl: "/avatars/user1.jpg",
    comment:
      "Khóa học rất hữu ích và dễ hiểu. Tôi đã học được rất nhiều kiến thức mới.",
  },
  {
    name: "Trần Thị B",
    avatarUrl: "/avatars/user2.jpg",
    comment: "Giảng viên nhiệt tình, nội dung phong phú. Rất đáng để tham gia.",
  },
  {
    name: "Lê Văn C",
    avatarUrl: "/avatars/user3.jpg",
    comment:
      "Nền tảng học tập tuyệt vời, hỗ trợ tốt. Tôi sẽ giới thiệu cho bạn bè.",
  },
];

const TestimonialCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const TestimonialsSection: React.FC = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#fff" }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Học Viên Nói Gì Về Chúng Tôi
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Những đánh giá chân thực từ các học viên đã tham gia khóa học
      </Typography>
      <Grid container spacing={4}>
        {TESTIMONIALS.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <TestimonialCard elevation={0}>
              <Avatar
                src={testimonial.avatarUrl}
                alt={testimonial.name}
                sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}
              />
              <Typography variant="h6" fontWeight="bold">
                {testimonial.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                "{testimonial.comment}"
              </Typography>
            </TestimonialCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TestimonialsSection;
