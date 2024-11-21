import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Avatar,
    TextField,
    Divider,
    Box,
    CircularProgress,
} from "@mui/material";
import { useAppContext } from "@/context/AppContext";

type DetailRequestProps = {
    open: boolean;
    requestId: string | null; // ID của request được chọn
    onClose: () => void; // Hàm đóng dialog
};

const DetailRequest: React.FC<DetailRequestProps> = ({ open, requestId, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState<any>(null); // Dữ liệu của request
    const { sessionToken } = useAppContext();

    const fetchDetailRequest = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/refund/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRequest(data.message);
            } else {
                console.error("Failed to fetch request detail:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching request detail:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && requestId) {
            fetchDetailRequest(requestId);
        }
    }, [open, requestId]);

    if (!requestId) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent>
                {loading ? (
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="center"
                        style={{ height: "200px" }}
                    >
                        <CircularProgress />
                    </Grid>
                ) : request ? (
                    <Box sx={{ padding: 3 }}>
                        <Divider sx={{ my: 2 }} />
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                marginBottom: 3,
                                color: "#1976d2",
                            }}
                        >
                            Chi tiết yêu cầu hoàn tiền
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Thông tin tài khoản */}
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: 3,
                                        backgroundColor: "#f5f5f5",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", marginBottom: 2, color: "#1976d2" }}
                                    >
                                        Thông tin tài khoản
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Số tài khoản"
                                                value={request.payeeAccount.bankNumber}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Tên ngân hàng"
                                                value={request.payeeAccount.bankName}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Tên người nhận"
                                                value={request.payeeAccount.receiverName}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            {/* Thông tin yêu cầu */}
                            <Grid item xs={12}>
                                <Box
                                    sx={{
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: 3,
                                        backgroundColor: "#ffffff",
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", marginBottom: 2, color: "#1976d2" }}
                                    >
                                        Thông tin yêu cầu
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                value={request.email}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Mã đơn hàng"
                                                value={request.orderCode}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Số tiền"
                                                value={`${request.amount.toLocaleString()} VND`}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Trạng thái"
                                                value={request.status}
                                                variant="outlined"
                                                InputProps={{
                                                    readOnly: true,
                                                    style: {
                                                        color:
                                                            request.status === "Đã hoàn tiền"
                                                                ? "#28a745" // Xanh lá cây
                                                                : request.status === "Đang xử lý"
                                                                    ? "#ff9800" // Cam
                                                                    : request.status === "Đã chấp nhận"
                                                                        ? "#007bff" // Xanh dương
                                                                        : request.status === "Từ chối"
                                                                            ? "#dc3545" // Đỏ
                                                                            : "#000", // Mặc định
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Lý do"
                                                value={request.reason}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                                multiline
                                                minRows={2}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Ngày"
                                                value={new Date(request.date).toLocaleDateString("vi-VN")}
                                                variant="outlined"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                ) : (
                    <Typography variant="body2" color="error">
                        Không tìm thấy chi tiết yêu cầu hoàn tiền.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetailRequest;
