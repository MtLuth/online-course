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
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  TextField,
  Menu,
  MenuItem as MuiMenuItem,
  SelectChangeEvent,
} from "@mui/material";
import BaseCard from "@/components/shared/DashboardCard";
import { MoreVert, Search, Close } from "@mui/icons-material";
import { useAppContext } from "@/context/AppContext";
import DetailRequest from "@/sections/admin/DetailRequest";
import UpdateRequestDialog from "@/sections/admin/UpdateRequest";
import { request } from "http";
import { styled } from "@mui/system";

type RefundRequest = {
  id: string;
  email: string;
  orderCode: string;
  amount: number;
  status: string;
  date: string;
};
const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2, 2, 0, 0),
}));
const RefundRequestTable = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const { sessionToken } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(
    null
  );
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openEditStatusDialog, setOpenEditStatusDialog] = useState(false);

  const fetchRefundRequests = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());

      if (filterStatus !== "all") queryParams.set("status", filterStatus);
      if (searchTerm.trim()) queryParams.set("searchParam", searchTerm.trim());

      const url = `http://localhost:8080/api/v1/refund?${queryParams.toString()}`;
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

        setRefundRequests(
          results.map((item: any) => ({
            id: item.id,
            email: item.email,
            orderCode: item.orderCode,
            amount: item.amount,
            status: item.status,
            date: new Date(item.date).toLocaleDateString("vi-VN"),
          }))
        );
        setTotal(itemCount);
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching refund requests:", error);
    }
  };

  useEffect(() => {
    fetchRefundRequests();
  }, [page, limit, filterStatus, searchTerm]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    request: RefundRequest
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleOpenDetailDialog = () => {
    if (selectedRequest) setOpenDetailDialog(true);
    handleCloseMenu();
  };

  const handleOpenEditStatusDialog = () => {
    if (selectedRequest) setOpenEditStatusDialog(true);
    handleCloseMenu();
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleCloseEditStatusDialog = () => {
    setOpenEditStatusDialog(false);
  };
  const handleFilterStatusChange = (event: SelectChangeEvent<string>) => {
    setFilterStatus(event.target.value);
    setPage(1);
  };

  return (
    <BaseCard>
      <>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <HeaderBox>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Danh sách Yêu Cầu Hoàn Tiền
            </Typography>
          </HeaderBox>
        </Box>
        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {showSearch ? (
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo email hoặc mã đơn hàng"
              sx={{ width: "60%" }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      setShowSearch(false);
                      setSearchTerm("");
                      setPage(1);
                    }}
                  >
                    <Close />
                  </IconButton>
                ),
              }}
            />
          ) : (
            <IconButton onClick={() => setShowSearch(true)}>
              <Search />
            </IconButton>
          )}
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell align="right">
                  <FormControl variant="outlined" size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={handleFilterStatusChange}
                      label="Trạng thái"
                      autoWidth
                    >
                      <MenuItem value="all">Tất cả</MenuItem>
                      <MenuItem value="Accepted">Đã chấp nhận</MenuItem>
                      <MenuItem value="InProgress">Đang xử lý</MenuItem>
                      <MenuItem value="Complete">Đã hoàn tiền</MenuItem>
                      <MenuItem value="Reject">Từ chối</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {refundRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.orderCode}</TableCell>
                  <TableCell>{request.amount.toLocaleString()} VND</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          request.status === "Đã hoàn tiền"
                            ? "#28a745" // Xanh lá cây
                            : request.status === "Đang xử lý"
                            ? "#ff9800" // Cam
                            : request.status === "Đã chấp nhận"
                            ? "#007bff" // Xanh dương
                            : request.status === "Từ chối"
                            ? "#dc3545" // Đỏ
                            : "#000", // Màu mặc định
                        fontWeight: "bold",
                      }}
                    >
                      {request.status}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleOpenMenu(e, request)}
                      aria-label="Menu"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={(e, newPage) => setPage(newPage + 1)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => setLimit(parseInt(e.target.value, 10))}
        />
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiMenuItem onClick={handleOpenDetailDialog}>
            Xem chi tiết
          </MuiMenuItem>
          {selectedRequest?.status !== "Từ chối" &&
            selectedRequest?.status !== "Đã hoàn tiền" && (
              <MuiMenuItem onClick={handleOpenEditStatusDialog}>
                Cập nhật
              </MuiMenuItem>
            )}
        </Menu>

        <DetailRequest
          open={openDetailDialog}
          requestId={selectedRequest?.id || null}
          onClose={handleCloseDetailDialog}
        />
        <UpdateRequestDialog
          open={openEditStatusDialog}
          requestId={selectedRequest?.id || null}
          requestStatus={selectedRequest?.status || null}
          onClose={handleCloseEditStatusDialog}
          onStatusUpdate={fetchRefundRequests}
        />
      </>
    </BaseCard>
  );
};

export default RefundRequestTable;
