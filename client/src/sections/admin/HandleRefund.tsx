// src/sections/admin/HandleRefund.tsx

"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { MoreVert, Search, Close } from "@mui/icons-material";
import { useAppContext } from "@/context/AppContext";
import DetailRequest from "@/sections/admin/DetailRequest";
import UpdateRequestDialog from "@/sections/admin/UpdateRequest";
import { styled } from "@mui/system";
import debounce from "lodash/debounce";
import DashboardCard from "@/components/shared/DashboardCard"; // Đảm bảo đường dẫn và tên chính xác
import { useToastNotification } from "@/hook/useToastNotification";

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const RefundRequestTable = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(0);
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
  const [loading, setLoading] = useState(false);

  const { notifySuccess, notifyError } = useToastNotification();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const fetchRefundRequests = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", (page + 1).toString());
      queryParams.set("limit", limit.toString());

      if (filterStatus !== "all") queryParams.set("status", filterStatus);
      if (searchTerm.trim()) queryParams.set("searchParam", searchTerm.trim());

      const url = `${API_BASE_URL}/api/v1/refund?${queryParams.toString()}`;
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
        const errorData = await response.json();
        notifyError(
          errorData.message || "Không thể tải dữ liệu yêu cầu hoàn tiền."
        );
      }
    } catch (error: any) {
      notifyError("Đã xảy ra lỗi khi tải dữ liệu yêu cầu hoàn tiền.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterStatus, searchTerm]);

  useEffect(() => {
    fetchRefundRequests();
  }, [fetchRefundRequests]);

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
    setPage(0);
  };

  const handleSearchClear = () => {
    setSearchTerm("");
    setShowSearch(false);
    setPage(0);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      setPage(0);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  return (
    <DashboardCard>
      <>
        {/* Header */}
        <Box sx={{ textAlign: "center", py: 2 }}>
          <HeaderBox>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Danh sách Yêu cầu hoàn tiền
            </Typography>
          </HeaderBox>
        </Box>

        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Thanh Tìm Kiếm */}
          {showSearch ? (
            <TextField
              label="Tìm kiếm"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm theo email hoặc mã đơn hàng"
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
            <Tooltip title="Tìm kiếm">
              <IconButton
                onClick={() => setShowSearch(true)}
                aria-label="Open search"
                color="primary"
              >
                <Search />
              </IconButton>
            </Tooltip>
          )}

          {/* Lọc Trạng Thái */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterStatusChange}
              label="Trạng thái"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="InProgress">Đang xử lý</MenuItem>
              <MenuItem value="Complete">Đã hoàn tiền</MenuItem>
              <MenuItem value="Reject">Từ chối</MenuItem>
            </Select>
          </FormControl>
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
        ) : refundRequests.length > 0 ? (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Mã đơn hàng</StyledTableCell>
                  <StyledTableCell>Số tiền (VND)</StyledTableCell>
                  <StyledTableCell>Ngày</StyledTableCell>
                  <StyledTableCell align="right">Trạng thái</StyledTableCell>
                  <StyledTableCell align="center">Hành động</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {refundRequests.map((request) => (
                  <TableRow key={request.id} hover>
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
                      <Tooltip title="Thao tác">
                        <IconButton
                          onClick={(e) => handleOpenMenu(e, request)}
                          aria-label="Menu"
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
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
              Không có dữ liệu yêu cầu hoàn tiền.
            </Typography>
          </Box>
        )}

        {/* Phân Trang */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(event) =>
            setLimit(parseInt(event.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ mt: 2 }}
        />

        {/* Menu Thao Tác */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MenuItem onClick={handleOpenDetailDialog}>Xem chi tiết</MenuItem>
          {selectedRequest?.status !== "Từ chối" &&
            selectedRequest?.status !== "Đã hoàn tiền" && (
              <MenuItem onClick={handleOpenEditStatusDialog}>Cập nhật</MenuItem>
            )}
        </Menu>

        {/* Dialog Chi Tiết Yêu Cầu */}
        <DetailRequest
          open={openDetailDialog}
          requestId={selectedRequest?.id || null}
          onClose={handleCloseDetailDialog}
        />

        {/* Dialog Cập Nhật Trạng Thái Yêu Cầu */}
        <UpdateRequestDialog
          open={openEditStatusDialog}
          requestId={selectedRequest?.id || null}
          requestStatus={selectedRequest?.status || null}
          onClose={handleCloseEditStatusDialog}
          onStatusUpdate={fetchRefundRequests}
        />
      </>
    </DashboardCard>
  );
};

export default RefundRequestTable;
