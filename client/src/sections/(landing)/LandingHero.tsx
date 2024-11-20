"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import { bgGradient } from "@/theme/css";
import Iconify from "@/components/iconify";
import { useResponsive } from "@/hook/useResponsive";
import { useBoolean } from "@/hook/useBoolean";
import Image from "@/components/image";
import { dashboardApi } from "@/server/Dashboard";

const formatNumber = (num: number) => Intl.NumberFormat().format(num);

export default function LandingHero() {
  const theme = useTheme();
  const mdUp = useResponsive("up", "md");
  const videoOpen = useBoolean();

  const [summary, setSummary] = useState([
    { value: 0, label: "Chuyên gia", color: "success" },
    { value: 0, label: "Học viên", color: "warning" },
    { value: 0, label: "Khóa học", color: "error" },
  ]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await dashboardApi.getAdmin();
        if (response.status === "Successfully") {
          const data = response.message;
          setSummary([
            { value: data.teacher, label: "Chuyên gia", color: "success" },
            { value: data.student, label: "Học viên", color: "warning" },
            { value: data.numberOfCourses, label: "Khóa học", color: "error" },
          ]);
        }
      } catch (error) {}
    };

    fetchSummary();
  }, []);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_1.jpg",
        }),
        overflow: "hidden",
      }}
    >
      <Container
        sx={{
          py: 12,
          minHeight: { md: "100vh" },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={5}
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack
            spacing={3}
            textAlign={{ xs: "center", md: "left" }}
            maxWidth={{ md: "50%" }}
          >
            <Typography variant="h1" component="h2">
              <Box component="span" sx={{ color: "text.disabled" }}>
                Trực tuyến
              </Box>
              <Box
                component="span"
                sx={{ color: "primary.main", textDecoration: "underline" }}
              >
                {` Khóa học `}
              </Box>
              Từ Chuyên Gia
            </Typography>

            <Typography sx={{ color: "text.secondary", mt: 3, mb: 5 }}>
              Khám phá các khóa học trực tuyến miễn phí từ những chuyên gia hàng
              đầu, giúp bạn nâng cao kỹ năng và kiến thức trong mọi lĩnh vực.
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems="center"
            >
              <Stack
                direction="row"
                alignItems="center"
                sx={{ typography: "h6" }}
              >
                <Fab
                  size="medium"
                  color="info"
                  onClick={videoOpen.onTrue}
                  sx={{ mr: 1 }}
                >
                  <Iconify width={24} icon="carbon:play" />
                </Fab>
                Bắt Đầu Ngay
              </Stack>
            </Stack>

            <Divider sx={{ borderStyle: "dashed", mt: 8, mb: 6 }} />

            <Stack
              direction="row"
              spacing={{ xs: 3, sm: 10 }}
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              {summary.map((item) => (
                <Stack
                  key={item.label}
                  spacing={0.5}
                  sx={{ position: "relative" }}
                >
                  <Box
                    sx={{
                      top: 8,
                      left: -4,
                      width: 24,
                      height: 24,
                      opacity: 0.24,
                      borderRadius: "50%",
                      position: "absolute",
                      bgcolor: `${item.color}.main`,
                    }}
                  />
                  <Typography variant="h3">
                    {formatNumber(item.value)}+
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>

          {mdUp && (
            <Image
              visibleByDefault
              disabledEffect
              alt="teacher"
              src="/assets/images/course/course_teacher_hero.png"
              sx={{ width: "100%", maxWidth: 546, height: "auto" }}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}
