"use client";

import React from "react";
import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: "url('/images/hero-background.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  padding: theme.spacing(20, 2),
  textAlign: "center",
}));

const PageRegister = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/register");
  };

  return (
    <div>
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          backgroundColor: "primary.main",
          color: "#fff",
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sẵn Sàng Bắt Đầu Học Tập?
        </Typography>
        <Typography variant="h6" gutterBottom>
          Tham gia cùng hàng ngàn học viên và nâng cao kỹ năng của bạn ngay hôm
          nay
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 4 }}
          onClick={handleGetStarted}
        >
          Đăng Ký Ngay
        </Button>
      </Box>
    </div>
  );
};

export default PageRegister;
