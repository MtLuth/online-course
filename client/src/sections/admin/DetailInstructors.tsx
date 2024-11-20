import React, { useState } from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    Button,
    TextField,
    Snackbar,
    Alert,
    Avatar,
    Divider,
} from "@mui/material";
import { useAppContext } from "@/context/AppContext";

type Instructor = {
    uid: string;
    avt: string;
    fullName: string;
    email: string;
    expertise: string;
    experience: string;
    education: string;
    status: string;
};

type DetailInstructorProps = {
    open: boolean;
    instructor: Instructor | null;
    onClose: () => void;
    onUpdate: () => void;
};

const DetailInstructor: React.FC<DetailInstructorProps> = ({
    open,
    instructor,
    onClose,
    onUpdate,
}) => {
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const { sessionToken } = useAppContext();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const updateInstructorStatus = async (status: string, reason: string = "") => {
        if (!instructor?.uid) {
            showSnackbar("Không tìm thấy UID giảng viên.", "error");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/v1/auth/admin/update-instructor/${instructor.uid}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({ status, reason }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                showSnackbar(data.message || "Không thể cập nhật trạng thái.", "error");
                return;
            }

            showSnackbar("Cập nhật trạng thái thành công!", "success");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            showSnackbar("Có lỗi xảy ra.", "error");
        }
    };

    const handleApprove = () => {
        updateInstructorStatus("approve");
    };

    const handleConfirmReject = () => {
        if (!rejectionReason.trim()) {
            showSnackbar("Vui lòng nhập lý do từ chối.", "error");
            return;
        }
        updateInstructorStatus("reject", rejectionReason);
    };

    const handleRejectClick = () => {
        setIsRejecting(true);
    };

    const handleClose = () => {
        setIsRejecting(false);
        setRejectionReason("");
        onClose();
    };

    const getStatusLabel = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "Hoạt động";
            case "pending":
                return "Chờ duyệt";
            default:
                return "Không xác định";
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Chi tiết Giảng viên
                </DialogTitle>
                <DialogContent>
                    {instructor && (
                        <Box sx={{ padding: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <Avatar
                                        src={instructor.avt}
                                        alt="Ảnh đại diện"
                                        sx={{ width: 120, height: 120, margin: "auto" }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" align="center" sx={{ fontWeight: "bold" }}>
                                        {instructor.fullName}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        align="center"
                                        sx={{
                                            color:
                                                instructor.status === "active"
                                                    ? "green"
                                                    : instructor.status === "pending"
                                                        ? "orange"
                                                        : "gray",
                                        }}
                                    >
                                        {getStatusLabel(instructor.status)}
                                    </Typography>

                                </Grid>
                            </Grid>
                            <Divider sx={{ my: 3 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Họ và tên"
                                        value={instructor.fullName}
                                        variant="outlined"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={instructor.email}
                                        variant="outlined"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Chuyên môn"
                                        value={instructor.expertise}
                                        variant="outlined"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Kinh nghiệm"
                                        value={instructor.experience}
                                        variant="outlined"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Trình độ học vấn"
                                        value={instructor.education}
                                        variant="outlined"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                {isRejecting && (
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Ghi chú lý do không phê duyệt"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
                    <Button
                        onClick={handleApprove}
                        color="success"
                        variant="contained"
                        sx={{ width: "120px" }}
                        disabled={instructor?.status === "active"}
                    >
                        Duyệt đơn
                    </Button>
                    {instructor?.status === "pending" && (
                        <Button
                            onClick={isRejecting ? handleConfirmReject : handleRejectClick}
                            color="error"
                            variant="contained"
                            sx={{ width: "170px" }}
                        >
                            {isRejecting ? "Xác nhận từ chối" : "Từ chối"}
                        </Button>
                    )}
                    <Button onClick={handleClose} color="primary" variant="contained" sx={{ width: "100px" }}>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DetailInstructor;
