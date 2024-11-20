"use client";

import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    CircularProgress,
    Button,
    Snackbar,
    Alert,
    Card,
} from "@mui/material";
import Sidebar from "@/components/sidebar-profile/Sidebar-Profile";
import { useAppContext } from "@/context/AppContext";

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const { sessionToken } = useAppContext();

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setSnackbarMessage("Vui lòng nhập đầy đủ các trường.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setSnackbarMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/auth/new-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({
                        oldPassword,
                        newPassword,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Đổi mật khẩu thất bại.");
            }

            const result = await response.json();

            setSnackbarMessage(result.message || "Đổi mật khẩu thành công!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setSnackbarMessage(error.message || "Có lỗi xảy ra.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
            <Card sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex" }}>
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <Box sx={{ flex: 1, padding: 3 }}>
                        <Box sx={{ textAlign: "center", mb: 5 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                Đổi mật khẩu
                            </Typography>
                        </Box>

                        {isLoading && (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ mb: 3 }}
                            >
                                <CircularProgress />
                            </Box>
                        )}

                        {/* Form Đổi Mật Khẩu */}
                        <Box
                            sx={{
                                maxWidth: 400,
                                margin: "auto",
                                padding: 3,
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff",
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Mật khẩu hiện tại"
                                type="password"
                                variant="outlined"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            <TextField
                                fullWidth
                                label="Mật khẩu mới"
                                type="password"
                                variant="outlined"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            <TextField
                                fullWidth
                                label="Xác nhận mật khẩu mới"
                                type="password"
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleChangePassword}
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Card>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChangePassword;
