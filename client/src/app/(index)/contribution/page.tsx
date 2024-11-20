"use client";
import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";

const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const members = [
  {
    id: "21110242",
    name: "Nguyễn Minh",
    role: "Front-End",
    avatarUrl: "https://i.postimg.cc/2SQ1Rwsk/avatar1.png",
  },
  {
    id: "21110851",
    name: "Mai Tấn Tài",
    role: "Back-End",
    avatarUrl: "https://i.postimg.cc/2SQ1Rwsk/avatar1.png",
  },
  {
    id: "21110224",
    name: "Hồ Gia Kiệt",
    role: "Front-End",
    avatarUrl: "https://i.postimg.cc/2SQ1Rwsk/avatar1.png",
  },
];

const ContributionPage = () => {
  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 2 }}>
      {/* Tiêu đề */}
      <HeaderBox>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Đóng Góp Xây Dựng
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Xây dựng Website Quản lý Học tập cho Môi trường Giáo dục Số
        </Typography>
      </HeaderBox>

      {/* Danh sách thành viên */}
      <Grid container spacing={4}>
        {members.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card
              sx={{
                textAlign: "center",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <Avatar
                src={member.avatarUrl}
                alt={member.name}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  marginBottom: 2,
                }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {member.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Mã số sinh viên: {member.id}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  {member.role}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ContributionPage;
