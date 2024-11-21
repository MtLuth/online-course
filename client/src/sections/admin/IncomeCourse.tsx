// src/components/IncomeTable.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Paper,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import BaseCard from "@/components/shared/DashboardCard";
import { useAppContext } from "@/context/AppContext";
import { Visibility, Search, Close } from "@mui/icons-material";
import DetailIncomeDialog from "@/sections/admin/DetailIncomes";
import { useToastNotification } from "@/hook/useToastNotification";

type IncomeRecord = {
  uid: string;
  courseTitle: string;
  orderCode: string;
  amount: number;
  date: string;
  status: string;
};

const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const IncomeTable = () => {
  const [incomeData, setIncomeData] = useState<IncomeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const { sessionToken } = useAppContext();
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IncomeRecord | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError } = useToastNotification();

  const fetchIncomeData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());
      if (searchTerm.trim()) queryParams.set("search", searchTerm.trim());
      const url = `http://localhost:8080/api/v1/income?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const { results, itemCount } = data.message;

        setIncomeData(
          results.map((item: any) => ({
            uid: item.uid,
            courseTitle: item.course.title,
            orderCode: item.orderCode,
            amount: item.amount,
            date: new Date(item.date * 1000).toLocaleDateString("vi-VN"),
            status: item.status,
          }))
        );
        setTotal(itemCount);
      } else {
        const errorData = await response.json();
        notifyError(errorData.message || "Không thể tải dữ liệu doanh thu.");
      }
    } catch (error: any) {
      notifyError("Đã xảy ra lỗi khi tải dữ liệu doanh thu.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record: IncomeRecord) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedRecord(null);
    setOpenDialog(false);
  };

  useEffect(() => {
    fetchIncomeData();
  }, [page, limit, searchTerm]);

  const handleSearchClear = () => {
    setSearchTerm("");
    setShowSearch(false);
    setPage(1);
  };

  return (
    <BaseCard>
      <Box sx={{ textAlign: "center", py: 2 }}>
        <HeaderBox>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Thống kê Doanh Thu
          </Typography>
        </HeaderBox>
      </Box>

      <Box mb={2} display="flex" justifyContent="flex-end" alignItems="center">
        {showSearch ? (
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên khóa học hoặc mã đơn hàng"
            sx={{ width: { xs: "100%", sm: "60%" }, mr: 1 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={handleSearchClear}
                  aria-label="Clear search"
                >
                  <Close />
                </IconButton>
              ),
            }}
          />
        ) : (
          <IconButton
            onClick={() => setShowSearch(true)}
            aria-label="Open search"
            color="primary"
          >
            <Search />
          </IconButton>
        )}
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : incomeData.length > 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Khóa học</StyledTableCell>
                <StyledTableCell>Mã đơn hàng</StyledTableCell>
                <StyledTableCell>Số tiền (VND)</StyledTableCell>
                <StyledTableCell>Ngày</StyledTableCell>
                <StyledTableCell>Trạng thái</StyledTableCell>
                <StyledTableCell align="center">Hành động</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomeData.map((record) => (
                <TableRow key={record.uid} hover>
                  <TableCell>{record.courseTitle}</TableCell>
                  <TableCell>{record.orderCode}</TableCell>
                  <TableCell>{record.amount.toLocaleString()}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        record.status === "Hoàn thành"
                          ? "success.main"
                          : record.status === "Đang chờ"
                          ? "warning.main"
                          : "error.main",
                      fontWeight: "bold",
                    }}
                  >
                    {record.status}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleViewDetails(record)}
                      aria-label="Xem chi tiết"
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Không có dữ liệu doanh thu.
          </Typography>
        </Box>
      )}

      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={(event, newPage) => setPage(newPage + 1)}
        rowsPerPage={limit}
        onRowsPerPageChange={(event) =>
          setLimit(parseInt(event.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ mt: 2 }}
      />

      <DetailIncomeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        record={selectedRecord}
      />
    </BaseCard>
  );
};

export default IncomeTable;
