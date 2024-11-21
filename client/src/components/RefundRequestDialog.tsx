// components/RefundRequestDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Autocomplete,
  Avatar,
} from "@mui/material";
import { Purchase } from "../app/history/page"; // Adjust the import path as necessary
import { refundApi } from "@/server/Refund";
import { paymentApi } from "@/server/Payment"; // Import PaymentApi
import Cookies from "js-cookie";
import { useToastNotification } from "@/hook/useToastNotification";

interface PayeeAccount {
  bankNumber: string;
  bankName: string;
  receiverName: string;
}

interface RefundPayload {
  payeeAccount: PayeeAccount;
  reason: string;
  courses: string[];
  orderCode: string;
}

interface Bank {
  bankName: string;
  logo: string;
}

interface RefundRequestDialogProps {
  open: boolean;
  handleClose: () => void;
  purchase: Purchase | null;
}

const RefundRequestDialog: React.FC<RefundRequestDialogProps> = ({
  open,
  handleClose,
  purchase,
}) => {
  const [payeeAccount, setPayeeAccount] = useState<PayeeAccount>({
    bankNumber: "",
    bankName: "",
    receiverName: "",
  });
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // State for Bank Data
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState<boolean>(false);
  const [banksError, setBanksError] = useState<string>("");

  const { notifySuccess, notifyError } = useToastNotification();

  // Fetch banks when the dialog opens
  useEffect(() => {
    if (open) {
      const fetchBanks = async () => {
        setBanksLoading(true);
        setBanksError("");
        try {
          const response = await paymentApi.bank();
          console.log("Bank API Response:", response);
          if (response.status === "Successfully") {
            setBanks(response.message);
          } else {
            throw new Error(
              typeof response.message === "string"
                ? response.message
                : "Không thể tải danh sách ngân hàng."
            );
          }
        } catch (error: any) {
          console.error("Error fetching banks:", error);
          setBanksError(
            error.message || "Đã xảy ra lỗi khi tải danh sách ngân hàng."
          );
          notifyError(
            error.message || "Đã xảy ra lỗi khi tải danh sách ngân hàng."
          );
        } finally {
          setBanksLoading(false);
        }
      };

      fetchBanks();
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPayeeAccount((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (event: any, value: Bank | null) => {
    setPayeeAccount((prev) => ({
      ...prev,
      bankName: value ? value.bankName : "",
    }));
  };

  const handleSubmit = async () => {
    if (!purchase) return;

    // Basic validation
    if (
      !payeeAccount.bankNumber ||
      !payeeAccount.bankName ||
      !payeeAccount.receiverName ||
      !reason
    ) {
      notifyError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const payload: RefundPayload = {
      payeeAccount,
      reason,
      courses: purchase.sku.map((course) => course.courseId),
      orderCode: purchase.code,
    };

    const token = Cookies.get("accessToken");
    if (!token) {
      notifyError("Không tìm thấy token xác thực. Vui lòng đăng nhập.");
      handleClose();
      return;
    }

    setLoading(true);
    try {
      const response = await refundApi.cRefundUser(payload, token);
      console.log("Refund Response:", response);
      if (response.status === "Successfully") {
        notifySuccess("Yêu cầu hoàn tiền đã được gửi thành công.");
        handleClose();
      } else {
        throw new Error(
          typeof response.message === "string"
            ? response.message
            : "Không thể gửi yêu cầu hoàn tiền."
        );
      }
    } catch (error: any) {
      notifyError(error.message || "Đã xảy ra lỗi khi gửi yêu cầu hoàn tiền.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    if (!loading) {
      // Reset form fields when closing
      setPayeeAccount({
        bankNumber: "",
        bankName: "",
        receiverName: "",
      });
      setReason("");
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>Yêu Cầu Hoàn Tiền</DialogTitle>
      <DialogContent>
        {purchase && (
          <Typography variant="subtitle1" gutterBottom>
            Đơn hàng: {purchase.code}
          </Typography>
        )}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="h6">Thông Tin Ngân Hàng</Typography>
          </Grid>
          <Grid item xs={12}>
            {banksLoading ? (
              <CircularProgress size={24} />
            ) : banksError ? (
              <Typography color="error">{banksError}</Typography>
            ) : (
              <Autocomplete
                options={banks}
                getOptionLabel={(option) => option.bankName}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Avatar
                      src={option.logo}
                      alt={option.bankName}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    {option.bankName}
                  </li>
                )}
                onChange={handleBankChange}
                value={
                  banks.find(
                    (bank) => bank.bankName === payeeAccount.bankName
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tên Ngân Hàng"
                    variant="outlined"
                    required
                  />
                )}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Số Tài Khoản Ngân Hàng"
              name="bankNumber"
              value={payeeAccount.bankNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tên Người Nhận"
              name="receiverName"
              value={payeeAccount.receiverName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Lý Do Hoàn Tiền"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || banksLoading || !!banksError}
        >
          {loading ? "Đang gửi..." : "Gửi Yêu Cầu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RefundRequestDialog;
