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
                setRequest(data.message); // Lưu dữ liệu vào state
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

    if (!requestId) return null; // Nếu không có ID, không render dialog

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                Xem chi tiết yêu cầu hoàn tiền
            </DialogTitle>
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
                        <Grid container spacing={2}>
                            {/* Email */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={request.email}
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            {/* Mã đơn hàng */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mã đơn hàng"
                                    value={request.orderCode}
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            {/* Số tiền */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Số tiền"
                                    value={`${request.amount.toLocaleString()} VND`}
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            {/* Trạng thái */}
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
                                                    ? "#28a745"
                                                    : request.status === "Đang xử lý"
                                                        ? "#ff9800"
                                                        : "#dc3545",
                                        },
                                    }}
                                />
                            </Grid>
                            {/* Lý do */}
                            <Grid item xs={12}>
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
                            {/* Ngày */}
                            <Grid item xs={12}>
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
