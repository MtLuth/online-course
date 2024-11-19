"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import { getAuthToken } from "@/utils/auth";
import { walletApi } from "@/server/Wallet";
import { userApi } from "@/server/User"; // Import userApi

const Wallet: React.FC = () => {
  const [walletData, setWalletData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null); // State for user data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch user profile data based on walletData.uid
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

  // Handle withdraw button click
  const handleWithdraw = () => {
    // Thêm logic để xử lý rút tiền, có thể hiển thị một modal xác nhận
    alert("Rút tiền thành công!");
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
                Yêu Cầu Hoàn Tiền:
              </Typography>
              <Typography variant="h6" color="error">
                {walletData.refundRequest && walletData.refundRequest > 0
                  ? walletData.refundRequest.toLocaleString()
                  : "N/A"}{" "}
                VND
              </Typography>
            </Box>

            {/* User Profile Information */}

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
              onClick={handleWithdraw}
              disabled={walletData.withdrawable <= 0}
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
    </Box>
  );
};

export default Wallet;
