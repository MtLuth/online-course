"use client";
import InfoIcon from "@mui/icons-material/Info";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import PurchaseDetailsModal from "@/components/PurchaseDetailsModal";
import { useToastNotification } from "@/hook/useToastNotification";
import { historyApi } from "@/server/History";
import HistoryIcon from "@mui/icons-material/History";
import { useRouter } from "next/navigation";
import RefundRequestDialog from "@/components/RefundRequestDialog";

interface Course {
  courseId: string;
  title: string;
  price: number;
  salePrice: number;
}

interface Purchase {
  code: string;
  boughtAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  sku: Course[];
  total: number;
  status: string;
}

interface HistoryResponse {
  status: string;
  message: {
    prchases: Purchase[];
    total: number;
  };
}

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const { notifySuccess, notifyError } = useToastNotification();

  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const [selectedPurchaseForRefund, setSelectedPurchaseForRefund] =
    useState<Purchase | null>(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState<boolean>(false);

  const handleOpenRefundDialog = (purchase: Purchase) => {
    setSelectedPurchaseForRefund(purchase);
    setRefundDialogOpen(true);
  };

  const handleCloseRefundDialog = () => {
    setSelectedPurchaseForRefund(null);
    setRefundDialogOpen(false);
  };
  const handleOpenModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPurchase(null);
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          throw new Error("Không tìm thấy token xác thực. Vui lòng đăng nhập.");
        }

        const response: HistoryResponse = await historyApi.getHistory(token);

        console.log("API Response:", response);

        if (response.status === "Successfully") {
          setHistory(response.message.prchases);
        } else {
          throw new Error(
            typeof response.message === "string"
              ? response.message
              : "Không thể tải lịch sử mua hàng."
          );
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải lịch sử mua hàng.");
        notifyError(err.message || "Đã xảy ra lỗi khi tải lịch sử mua hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!Array.isArray(history) || history.length === 0) {
    return (
      <Box sx={{ padding: 4 }}>
        <Typography variant="h6" align="center">
          Bạn chưa có đơn hàng nào.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Lịch Sử Mua Hàng</Typography>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<HistoryIcon />}
          onClick={() => router.push("/refund")}
        >
          Lịch sử hoàn tiền
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã Đơn Hàng</TableCell>
              <TableCell>Ngày Mua</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell align="right">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((purchase) => {
              const purchaseDate = dayjs(
                purchase.boughtAt._seconds * 1000 +
                  purchase.boughtAt._nanoseconds / 1e6
              );

              const isRefundable = true;

              return (
                <TableRow key={purchase.code}>
                  <TableCell>{purchase.code}</TableCell>
                  <TableCell>
                    {purchaseDate.format("DD/MM/YYYY HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {purchase.total.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TableCell>
                  <TableCell align="right">
                    {isRefundable && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenRefundDialog(purchase)}
                        startIcon={<AttachMoneyIcon />}
                        sx={{
                          marginRight: 1,
                          textTransform: "none",
                          padding: "6px 16px",
                        }}
                      >
                        Hoàn Tiền
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(purchase)}
                      startIcon={<InfoIcon />}
                      sx={{ textTransform: "none", padding: "6px 16px" }}
                    >
                      Chi Tiết
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <PurchaseDetailsModal
        open={modalOpen}
        handleClose={handleCloseModal}
        purchase={selectedPurchase}
      />
      <RefundRequestDialog
        open={refundDialogOpen}
        handleClose={handleCloseRefundDialog}
        purchase={selectedPurchaseForRefund}
      />
    </Box>
  );
};

export default HistoryPage;
