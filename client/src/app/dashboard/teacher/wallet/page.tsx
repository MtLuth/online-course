// src/components/Wallet.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from "@mui/material";
import { getAuthToken } from "@/utils/auth";
import { walletApi } from "@/server/Wallet";
import { userApi } from "@/server/User";
import { useToastNotification } from "@/hook/useToastNotification";
import { paymentApi } from "@/server/Payment";

interface Bank {
  bankName: string;
  logo: string;
}

interface WithdrawData {
  bankName: string;
  bankNumber: string;
  amount: number;
}

interface WalletData {
  uid: string;
  inProgress: number;
  withdrawable: number;
  withdrawnAmount: number;
  withdrawPending: number;
}

const Wallet: React.FC = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [userData, setUserData] = useState<any>(null); // State for user data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]); // State for bank list

  const [openWithdraw, setOpenWithdraw] = useState<boolean>(false);
  const [withdrawData, setWithdrawData] = useState<WithdrawData>({
    bankName: "",
    bankNumber: "",
    amount: 0,
  });
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);

  const { notifySuccess, notifyError } = useToastNotification();

  const token = getAuthToken();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await walletApi.walletGet(token);
        if (response.status === "Successfully") {
          setWalletData(response.message);
        } else {
          setError("Không thể tải thông tin ví.");
        }
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tải thông tin ví.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [token]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (walletData && walletData.uid) {
        try {
          const response = await userApi.profileUser(walletData.uid, token);
          if (response.status === "Successfully") {
            setUserData(response.message);
          } else {
            setError("Không thể tải thông tin người dùng.");
          }
        } catch (err) {
          console.error(err);
          setError("Đã xảy ra lỗi khi tải thông tin người dùng.");
        }
      }
    };

    fetchUserProfile();
  }, [walletData, token]); // Trigger when walletData changes

  // Fetch bank list when modal opens
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await paymentApi.bank();
        if (response.status === "Successfully") {
          setBanks(response.message);
        } else {
          notifyError("Không thể tải danh sách ngân hàng.");
        }
      } catch (err) {
        console.error(err);
        notifyError("Đã xảy ra lỗi khi tải danh sách ngân hàng.");
      }
    };

    if (openWithdraw) {
      fetchBanks();
    }
  }, [openWithdraw]);

  // Handle withdraw button click to open modal
  const handleWithdrawClick = () => {
    setOpenWithdraw(true);
  };

  // Handle modal close
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
    setWithdrawData({
      bankName: "",
      bankNumber: "",
      amount: 0,
    });
  };

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setWithdrawData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  // Handle withdraw form submission
  const handleWithdrawSubmit = async () => {
    const { bankName, bankNumber, amount } = withdrawData;

    // Validate input
    if (!bankName || !bankNumber || !amount) {
      notifyError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (amount > (walletData?.withdrawable || 0)) {
      notifyError("Số tiền rút phải nhỏ hơn số dư có thể rút!");
      return;
    }

    setWithdrawLoading(true);

    try {
      const response = await paymentApi.withDraw(
        {
          bankName,
          bankNumber,
          amount,
        },
        token
      );

      if (response.status === "Successfully") {
        notifySuccess(response.message);
        // Update wallet data
        setWalletData((prev) => ({
          ...prev!,
          withdrawable: prev!.withdrawable - amount,
          withdrawnAmount: prev!.withdrawnAmount + amount,
          withdrawPending: (prev!.withdrawPending || 0) + amount,
        }));
        handleCloseWithdraw();
      } else {
        // Handle API error message
        notifyError(response.message);
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra. Vui lòng thử lại sau.";
      notifyError(errorMessage);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        maxWidth: 800,
        margin: "0 auto",
        minHeight: "60vh",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          backgroundColor: "#f4f4f4",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        Ví Của Tôi
      </Typography>

      {/* Error Message */}
      {error && (
        <Typography
          variant="body1"
          color="error"
          sx={{ textAlign: "center", mb: 2 }}
        >
          {error}
        </Typography>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : walletData ? (
        <Card sx={{ padding: 3, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            {userData && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Thông Tin Người Dùng
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Avatar
                    src={userData.avt}
                    alt={userData.fullName}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {userData.fullName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Số Tiền Có Thể Rút:
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {walletData.withdrawable.toLocaleString()} VND
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Số Tiền Đã Rút:
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {walletData.withdrawnAmount.toLocaleString()} VND
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Yêu Cầu Rút Tiền:
              </Typography>
              <Typography variant="h6" color="error">
                {walletData.withdrawPending && walletData.withdrawPending > 0
                  ? walletData.withdrawPending.toLocaleString()
                  : "0"}{" "}
                VND
              </Typography>
            </Box>

            {/* Withdraw Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                marginTop: 3,
                padding: "12px",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={handleWithdrawClick}
              disabled={!walletData || walletData.withdrawable <= 0}
            >
              Rút Tiền
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ textAlign: "center", mt: 4 }}
        >
          Không có dữ liệu ví.
        </Typography>
      )}

      {/* Withdraw Modal */}
      <Dialog
        open={openWithdraw}
        onClose={handleCloseWithdraw}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rút Tiền</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            {/* Autocomplete Cho Chọn Ngân Hàng */}
            <Autocomplete
              options={banks}
              getOptionLabel={(option) => option.bankName}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ display: "flex", alignItems: "center" }}
                  {...props}
                  key={option.bankName}
                >
                  <Avatar
                    src={option.logo}
                    alt={option.bankName}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  {option.bankName}
                </Box>
              )}
              value={
                banks.find((bank) => bank.bankName === withdrawData.bankName) ||
                null
              }
              onChange={(event, newValue) => {
                setWithdrawData((prev) => ({
                  ...prev,
                  bankName: newValue ? newValue.bankName : "",
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn Ngân Hàng"
                  required
                  margin="normal"
                />
              )}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="bankNumber"
              label="Số Tài Khoản Ngân Hàng"
              name="bankNumber"
              value={withdrawData.bankNumber}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="amount"
              label="Số Tiền (VND)"
              name="amount"
              type="number"
              InputProps={{
                inputProps: { min: 1, max: walletData?.withdrawable || 0 },
              }}
              value={withdrawData.amount}
              onChange={handleChange}
              helperText={`Tối đa: ${
                walletData ? walletData.withdrawable.toLocaleString() : "0"
              } VND`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdraw} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleWithdrawSubmit}
            color="primary"
            variant="contained"
            disabled={withdrawLoading}
          >
            {withdrawLoading ? <CircularProgress size={24} /> : "Xác Nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wallet;
