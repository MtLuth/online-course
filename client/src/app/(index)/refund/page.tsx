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
  CircularProgress,
  Alert,
  Pagination,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { refundApi } from "@/server/Refund";
import { getAuthToken } from "@/utils/auth";
import { useToastNotification } from "@/hook/useToastNotification";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export interface PayeeAccount {
  bankNumber: string;
  bankName: string;
  receiverName: string;
}

export interface Course {
  courseId: string;
  price: number;
  title: string;
}

export interface RefundItem {
  id: string;
  orderCode: string;
  courses: Course[];
  amount: number;
  reason: string;
  payeeAccount: PayeeAccount;
  uid: string;
  email: string;
  date: number;
  status: string;
}

export interface RefundMessage {
  results: RefundItem[];
  pageCount: number;
  itemCount: number;
  pages: {
    number: number;
    url: string;
  }[];
}

export interface RefundResponse {
  status: string;
  message: RefundMessage;
}

const RefundList: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [cancelingId, setCancelingId] = useState<string | null>(null); // Trạng thái hủy
  const [openDialog, setOpenDialog] = useState<boolean>(false); // Trạng thái Dialog
  const [selectedRefund, setSelectedRefund] = useState<RefundItem | null>(null); // Yêu cầu được chọn để hủy

  const { notifyError, notifySuccess } = useToastNotification();

  const refundsPerPage = 5;

  const fetchRefunds = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Vui lòng đăng nhập để xem yêu cầu hoàn tiền.");
        setLoading(false);
        return;
      }

      const response: RefundResponse = await refundApi.refundUser(token);

      if (response.status === "Successfully") {
        setRefunds(response.message.results);
        setPageCount(response.message.pageCount);
        setItemCount(response.message.itemCount);
      } else {
        setError(response.status || "Không thể tải dữ liệu.");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      notifyError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds(currentPage);
  }, [currentPage]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã hoàn tiền":
        return "success";
      case "Hệ thống từ chối":
        return "error";
      default:
        return "default";
    }
  };

  // Mở Dialog xác nhận hủy yêu cầu
  const handleOpenDialog = (refund: RefundItem) => {
    setSelectedRefund(refund);
    setOpenDialog(true);
  };

  // Đóng Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRefund(null);
  };

  // Hàm hủy yêu cầu hoàn tiền
  const handleCancelRefund = async () => {
    if (!selectedRefund) return;
    setCancelingId(selectedRefund.id);
    try {
      const token = getAuthToken();
      if (!token) {
        notifyError("Vui lòng đăng nhập để thực hiện hành động này.");
        return;
      }

      const response = await refundApi.refundPutUser(selectedRefund.id, token);

      if (response.status === "Successfully") {
        notifySuccess("Hủy yêu cầu hoàn tiền thành công.");
        fetchRefunds(currentPage);
      } else {
        notifyError(response.status || "Không thể hủy yêu cầu.");
      }
    } catch (err: any) {
      notifyError(err.message || "Đã xảy ra lỗi khi hủy yêu cầu.");
    } finally {
      setCancelingId(null);
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          padding: 2,
          backgroundColor: "#c5c5c573",
          borderRadius: 2,
        }}
      >
        Danh Sách Yêu Cầu Hoàn Tiền
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : refunds.length === 0 ? (
        <Alert severity="info">Không có yêu cầu hoàn tiền nào.</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="refund table">
              <TableHead>
                <TableRow>
                  <TableCell>Mã Đơn Hàng</TableCell>
                  <TableCell>Khóa Học</TableCell>
                  <TableCell>Số Tiền (VND)</TableCell>
                  <TableCell>Lý Do</TableCell>
                  <TableCell>Tài Khoản Nhận Tiền</TableCell>
                  <TableCell>Ngày Tạo</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {refunds.map((refund) => (
                  <TableRow key={refund.id}>
                    <TableCell>{refund.orderCode}</TableCell>
                    <TableCell>
                      {refund.courses.map((course, index) => (
                        <Box
                          key={index}
                          sx={{ mb: index < refund.courses.length - 1 ? 1 : 0 }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {course.title}
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(refund.amount)}
                    </TableCell>
                    <TableCell>{refund.reason}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Ngân Hàng: {refund.payeeAccount.bankName}
                        </Typography>
                        <Typography variant="body2">
                          Số Tài Khoản: {refund.payeeAccount.bankNumber}
                        </Typography>
                        <Typography variant="body2">
                          Tên Người Nhận: {refund.payeeAccount.receiverName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(refund.date), "dd/MM/yyyy HH:mm:ss", {
                        locale: vi,
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={refund.status}
                        color={getStatusColor(refund.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {refund.status === "Đang xử lý" && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleOpenDialog(refund)}
                          disabled={cancelingId === refund.id}
                        >
                          {cancelingId === refund.id ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Hủy YC"
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Phân Trang */}
          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Dialog xác nhận hủy yêu cầu */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="cancel-refund-dialog-title"
        aria-describedby="cancel-refund-dialog-description"
      >
        <DialogTitle id="cancel-refund-dialog-title">
          Xác Nhận Hủy Yêu Cầu Hoàn Tiền
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-refund-dialog-description">
            Bạn có chắc chắn muốn hủy yêu cầu hoàn tiền này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleCancelRefund} color="error" autoFocus>
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RefundList;
