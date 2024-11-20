"use client";

import React from "react";
import { Box, Typography, Grid, Paper, Stack, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import Iconify from "@/components/iconify";

const FEATURES = [
  {
    icon: "carbon:learning",
    title: "Học Tập Linh Hoạt",
    description:
      "Học bất cứ lúc nào, bất cứ nơi nào với các khóa học trực tuyến linh hoạt.",
  },
  {
    icon: "carbon:certified",
    title: "Chứng Chỉ Uy Tín",
    description:
      "Nhận chứng chỉ sau khi hoàn thành khóa học từ các chuyên gia hàng đầu.",
  },
  {
    icon: "carbon:group",
    title: "Cộng Đồng Mạnh Mẽ",
    description: "Tham gia cộng đồng học viên để chia sẻ và học hỏi thêm.",
  },
  {
    icon: "carbon:support",
    title: "Hỗ Trợ 24/7",
    description:
      "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc của bạn bất cứ lúc nào.",
  },
  {
    icon: "carbon:settings",
    title: "Công Cụ Học Tập Tiên Tiến",
    description:
      "Sử dụng các công cụ và tài nguyên học tập hiện đại để nâng cao trải nghiệm học tập.",
  },
  {
    icon: "carbon:earth",
    title: "Kết Nối Toàn Cầu",
    description:
      "Tiếp cận với học viên và chuyên gia từ khắp nơi trên thế giới.",
  },
];

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[6],
  },
}));

const FeaturesSection: React.FC = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#f9f9f9" }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
        Tại Sao Chọn Chúng Tôi
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất cho bạn với
        những tính năng vượt trội
      </Typography>
      <Grid container spacing={6}>
        {FEATURES.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard elevation={0}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 64,
                  height: 64,
                  mb: 3,
                }}
              >
                <Iconify
                  icon={feature.icon}
                  width={32}
                  height={32}
                  sx={{ color: "#fff" }}
                />
              </Avatar>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
