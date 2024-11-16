"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useToastNotification } from "@/hook/useToastNotification";

const LogoutPage: React.FC = () => {
  const router = useRouter();
  const { notifySuccess } = useToastNotification();

  useEffect(() => {
    Cookies.remove("accessToken");
    localStorage.clear();
    notifySuccess("Đăng xuất thành công!");
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router, notifySuccess]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Đang đăng xuất...
      </Typography>
    </Box>
  );
};

export default LogoutPage;
