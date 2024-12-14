"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { getAuthToken } from "@/utils/auth";
import { withdrawApi } from "@/server/Withdraw";
import { styled } from "@mui/system";
import { useToastNotification } from "@/hook/useToastNotification";
import DashboardCard from "@/components/shared/DashboardCard";

const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2, 2, 0, 0),
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.grey[200],
}));

// Định nghĩa bản đồ màu sắc cho các trạng thái
const statusColorMap: Record<
  string,
  "default" | "success" | "warning" | "error"
> = {
  "Chờ xử lý": "warning",
  "Hoàn thành": "success",
  "Đã hủy": "error",
};

const HandleWithdraw = () => {
  const [withdrawData, setWithdrawData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Thêm setLimit để thay đổi limit
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedWithdrawToCancel, setSelectedWithdrawToCancel] =
    useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { notifySuccess, notifyError } = useToastNotification();

  const fetchWithdraws = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await withdrawApi.withdrawAdmin(
        token,
        limit,
        page,
        status
      );
      const { results, pageCount } = response.message;

      setWithdrawData(results);
      setTotalPages(pageCount);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawDetails = async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await withdrawApi.getWithdrawAdmin(id, token);
      setSelectedWithdraw(response.message);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching withdraw details:", error);
      notifyError("Không thể tải chi tiết yêu cầu rút tiền. Vui lòng thử lại.");
    }
  };

  const handleConfirmWithdraw = async (id: string) => {
    try {
      const token = getAuthToken();
      await withdrawApi.WithdrawPutAdmin(id, { status: "Complete" }, token);
      notifySuccess("Xác nhận rút tiền thành công!");
      fetchWithdraws();
      if (dialogOpen) handleDialogClose();
    } catch (error) {
      console.error("Error confirming withdraw:", error);
      notifyError("Không thể xác nhận rút tiền. Vui lòng thử lại.");
    }
  };

  const handleCancelWithdraw = async () => {
    if (!cancelReason.trim()) {
      notifyError("Vui lòng nhập lý do hủy!");
      return;
    }

    try {
      const token = getAuthToken();
      await withdrawApi.WithdrawPutAdmin(
        selectedWithdrawToCancel.id,
        { status: "Cancel", reason: cancelReason },
        token
      );
      notifySuccess("Hủy yêu cầu rút tiền thành công!");
      setCancelDialogOpen(false);
      setCancelReason("");
      fetchWithdraws();
      if (dialogOpen) handleDialogClose();
    } catch (error) {
      console.error("Error cancelling withdraw:", error);
      notifyError("Không thể hủy yêu cầu rút tiền. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, [page, limit, status]); // Thêm limit vào dependency

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as string);
    setPage(1); // Reset về trang đầu tiên khi thay đổi trạng thái
  };

  const handleLimitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLimit(event.target.value as number);
    setPage(1); // Reset về trang đầu tiên khi thay đổi số lượng mục
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedWithdraw(null);
  };

  const openCancelDialog = (withdraw: any) => {
    setSelectedWithdrawToCancel(withdraw);
    setCancelDialogOpen(true);
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setSelectedWithdrawToCancel(null);
    setCancelReason("");
  };

  return (
    <DashboardCard>
      <Box sx={{ p: 3, maxWidth: "1200px", margin: "auto" }}>
        <HeaderBox>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Danh sách Yêu cầu Rút Tiền
          </Typography>
        </HeaderBox>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold"></Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-select-label">Trạng thái</InputLabel>
            <Select
              labelId="status-select-label"
              value={status}
              onChange={handleStatusChange}
              label="Trạng thái"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Pending">Chờ xử lý</MenuItem>
              <MenuItem value="Complete">Hoàn thành</MenuItem>
              <MenuItem value="Cancel">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Họ và Tên</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Số tiền</TableHeaderCell>
                <TableHeaderCell>Ngày</TableHeaderCell>
                <TableHeaderCell>Trạng thái</TableHeaderCell>
                <TableHeaderCell>Hành động</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress />
                      <Typography variant="body2" mt={2}>
                        Đang tải dữ liệu...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : withdrawData.length > 0 ? (
                withdrawData.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.amount} VND</TableCell>{" "}
                    {/* Loại bỏ .toLocaleString() */}
                    <TableCell>
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={statusColorMap[item.status] || "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => fetchWithdrawDetails(item.id)}
                        aria-label="view details"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {item.status === "Chờ xử lý" && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleConfirmWithdraw(item.id)}
                            aria-label="confirm withdraw"
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => openCancelDialog(item)}
                            aria-label="cancel withdraw"
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Alert severity="info">Không có dữ liệu</Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Thêm lựa chọn số lượng mục trên mỗi trang và Pagination */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="rows-per-page-select-label">Số lượng</InputLabel>
            <Select
              labelId="rows-per-page-select-label"
              id="rows-per-page-select"
              value={limit}
              label="Số lượng"
              onChange={handleLimitChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>

        {/* Dialog for Withdraw Details */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Chi tiết Yêu cầu Rút Tiền</DialogTitle>
          <DialogContent>
            {selectedWithdraw ? (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Thông Tin Giảng Viên
                        </Typography>
                        <Typography>
                          <strong>Họ và Tên:</strong>{" "}
                          {selectedWithdraw.instructor.fullName}
                        </Typography>
                        <Typography>
                          <strong>Email:</strong>{" "}
                          {selectedWithdraw.instructor.email}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Thông Tin Ngân Hàng
                        </Typography>
                        <Typography>
                          <strong>Tên Ngân Hàng:</strong>{" "}
                          {selectedWithdraw.bankName}
                        </Typography>
                        <Typography>
                          <strong>Số Tài Khoản:</strong>{" "}
                          {selectedWithdraw.bankNumber}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Số tiền:</strong> {selectedWithdraw.amount} VND{" "}
                      {/* Loại bỏ .toLocaleString() */}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Trạng thái:</strong>{" "}
                      <Chip
                        label={selectedWithdraw.status}
                        color={
                          statusColorMap[selectedWithdraw.status] || "default"
                        }
                        variant="outlined"
                      />
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Ngày:</strong>{" "}
                      {new Date(selectedWithdraw.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  {selectedWithdraw.status === "Đã hủy" &&
                    selectedWithdraw.reason && (
                      <Grid item xs={12}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Lý do Hủy
                            </Typography>
                            <Typography>{selectedWithdraw.reason}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}
                  {/* Thêm nút hành động nếu trạng thái là "Chờ xử lý" */}
                  {selectedWithdraw.status === "Chờ xử lý" && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => openCancelDialog(selectedWithdraw)}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CheckIcon />}
                          onClick={() =>
                            handleConfirmWithdraw(selectedWithdraw.id)
                          }
                        >
                          Xác nhận
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDialogClose}
              color="primary"
              variant="contained"
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Cancel Withdraw */}
        <Dialog
          open={cancelDialogOpen}
          onClose={handleCancelDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Hủy Yêu cầu Rút Tiền</DialogTitle>
          <DialogContent>
            <Typography>
              Vui lòng nhập lý do hủy yêu cầu rút tiền này:
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Lý do"
              type="text"
              fullWidth
              variant="outlined"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDialogClose} color="secondary">
              Hủy
            </Button>
            <Button
              onClick={handleCancelWithdraw}
              color="error"
              variant="contained"
            >
              Xác nhận Hủy
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardCard>
  );
};

export default HandleWithdraw;
