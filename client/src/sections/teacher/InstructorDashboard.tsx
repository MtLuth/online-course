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
import { getAuthToken } from "@/utils/auth";

/**
 * Định nghĩa kiểu dữ liệu cho thông tin dashboard của instructor
 */
interface InstructorDashboardData {
  published: number;
  unPublished: number;
  numberStudents: number;
  amount: number;
  order: number;
}

const InstructorDashboard: React.FC = () => {
  // Trạng thái dữ liệu, tải và lỗi
  const [data, setData] = useState<InstructorDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useToastNotification();

  const theme = useTheme();
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Không tìm thấy token xác thực.");
        }

        const response = await dashboardApi.getIns(token);
        if (response.status === "Successfully") {
          setData(response.message);
        } else {
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

    fetchInstructorData();
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
    if (!data) return { publicationData: [], financialData: [], orderData: [] };

    const publicationData = [
      { name: "Đã xuất bản", value: data.published },
      { name: "Chưa xuất bản", value: data.unPublished },
    ];

    const financialData = [{ name: "Số tiền", value: data.amount }];

    const orderData = [{ name: "Số khóa học đã mua", value: data.order }];

    return { publicationData, financialData, orderData };
  };

  const { publicationData, financialData, orderData } = prepareChartData();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main,
  ];

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân bố Khóa học
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={publicationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill={theme.palette.primary.main}
                  label
                >
                  {publicationData.map((entry, index) => (
                    <Cell
                      key={`cell-publication-${index}`}
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

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Số Khóa học Đã mua
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.warning.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Biểu đồ Số Lượng Sinh viên */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Số Lượng Sinh viên
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[{ name: "Số sinh viên", value: data.numberStudents }]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={theme.palette.error.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstructorDashboard;
