"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { dashboardApi } from "@/server/Dashboard";
import { useToastNotification } from "@/hook/useToastNotification";

interface DashboardData {
  teacher: number;
  student: number;
  admin: number;
  amount: number;
  order: number;
  numberOfCourses: number;
  numberInstructorPending: number;
  numberRefundInProgress: number;
  numberWithdrawPending: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { notifySuccess, notifyError } = useToastNotification();

  const theme = useTheme();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await dashboardApi.getAdmin();
        if (response.status === "Successfully") {
          setData(response.message);
        } else {
          const errorMsg = "Không thể lấy dữ liệu từ API.";
          setError(errorMsg);
          notifyError(errorMsg);
        }
      } catch (err: any) {
        const errorMsg = err.message || "Đã xảy ra lỗi.";
        setError(errorMsg);
        notifyError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const prepareChartData = () => {
    if (!data) return { userData: [], financialData: [], otherData: [] };

    const userData = [
      { name: "Chuyên Gia", value: data.teacher },
      { name: "Học Viên", value: data.student },
      { name: "Admin", value: data.admin },
    ];

    const financialData = [
      { name: "Số tiền", value: data.amount },
      { name: "Khóa học đã mua", value: data.order },
    ];

    const otherData = [
      { name: "Số khóa học", value: data.numberOfCourses },
      { name: "Chuyên Gia đang chờ", value: data.numberInstructorPending },
      { name: "Hoàn tiền đang xử lý", value: data.numberRefundInProgress },
      { name: "Rút tiền đang chờ", value: data.numberWithdrawPending },
    ];

    return { userData, financialData, otherData };
  };

  const { userData, financialData, otherData } = prepareChartData();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        {/* Biểu đồ Phân bố Người dùng */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân bố Người dùng
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill={theme.palette.primary.main}
                  label
                >
                  {userData.map((entry, index) => (
                    <Cell
                      key={`cell-user-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Biểu đồ Tổng quan Tài chính */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tổng quan Tài chính
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.success.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Biểu đồ Các Chỉ số Khác */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Các Chỉ số Khác
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={otherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.warning.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
