"use client";
import React from "react";
import { Grid, Paper } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import BaseCard from "@/components/shared/BaseCard";
import CategoriesList from "@/sections/admin/CategoriesList";
import { getAuthToken } from "@/utils/auth";

// Tạo Item với bo góc, độ bóng và khoảng cách padding đẹp hơn
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body1,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "60px",
  borderRadius: theme.shape.borderRadius, // Bo góc
  boxShadow: theme.shadows[2], // Thêm bóng
  padding: theme.spacing(2), // Thêm khoảng cách bên trong
  transition: "box-shadow 0.3s ease-in-out", // Thêm hiệu ứng chuyển động mượt mà
  "&:hover": {
    boxShadow: theme.shadows[6], // Tăng bóng khi hover
  },
}));

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2", // Màu chính nhẹ nhàng
    },
    background: {
      default: "#f4f6f8", // Màu nền nhẹ
    },
  },
});

const Tables = () => {
  const token = getAuthToken();
  return (
    <ThemeProvider theme={lightTheme}>
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ minWidth: "900px", margin: "0 auto" }}
      >
        <CategoriesList token={token} />
      </Grid>
    </ThemeProvider>
  );
};

export default Tables;
