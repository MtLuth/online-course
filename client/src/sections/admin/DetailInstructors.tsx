"use client";

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
  Avatar,
  Divider,
  Paper,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import { useToastNotification } from "@/hook/useToastNotification";
import { getAuthToken } from "@/utils/auth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

type Instructor = {
  id: string;
  avt: string;
  fullName: string;
  email: string;
  expertise: string;
  experience: number | string;
  education: string;
  status: string;
  bio: string;
  certificages: string; // Link của chứng chỉ
  rating: number | null;
  review: string | null;
};

type DetailInstructorProps = {
  open: boolean;
  instructor: Instructor | null;
  onClose: () => void;
  onUpdate: () => void;
};

// Styled components
const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: "center",
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const DetailInstructor: React.FC<DetailInstructorProps> = ({
  open,
  instructor,
  onClose,
  onUpdate,
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const sessionToken = getAuthToken();
  const { notifySuccess, notifyError } = useToastNotification(); // Sử dụng hook để hiển thị toast
  const [loading, setLoading] = useState(false); // State để quản lý trạng thái tải
  const [reasonError, setReasonError] = useState(false); // State để quản lý lỗi lý do từ chối

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Hoạt động";
      case "pending":
        return "Chờ duyệt";
      case "inactive":
        return "Chưa kích hoạt";
      default:
        return "Không xác định";
    }
  };

  const handleApprove = async () => {
    if (!instructor?.id) {
      notifyError("Không tìm thấy ID Chuyên Gia.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/admin/update-instructor/${instructor.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ status: "approve" }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notifyError(data.message || "Không thể cập nhật trạng thái.");
        setLoading(false);
        return;
      }

      notifySuccess("Cập nhật trạng thái thành công!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      notifyError("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = () => {
    setIsRejecting(true);
  };

  const handleConfirmReject = async () => {
    if (!instructor?.id) {
      notifyError("Không tìm thấy ID Chuyên Gia");
      return;
    }
    if (!rejectionReason.trim()) {
      notifyError("Vui lòng nhập lý do từ chối.");
      setReasonError(true);
      return;
    }
    if (rejectionReason.trim().length < 10) {
      notifyError("Lý do từ chối phải ít nhất 10 ký tự.");
      setReasonError(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/admin/update-instructor/${instructor.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({ status: "reject", reason: rejectionReason }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notifyError(data.message || "Không thể cập nhật trạng thái.");
        setLoading(false);
        return;
      }

      notifySuccess("Cập nhật trạng thái thành công!");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      notifyError("Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsRejecting(false);
    setRejectionReason("");
    setReasonError(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <StyledDialogTitle>Chi tiết Chuyên Gia</StyledDialogTitle>
        <DialogContent>
          {instructor && (
            <Box sx={{ padding: 3 }}>
              {/* Avatar và Thông tin cơ bản */}
              <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Avatar
                      src={instructor.avt}
                      alt="Ảnh đại diện"
                      sx={{
                        width: 150,
                        height: 150,
                        margin: "auto",
                        border: "4px solid #1976d2",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {instructor.fullName}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color:
                          instructor.status === "active"
                            ? "green"
                            : instructor.status === "pending"
                            ? "orange"
                            : "gray",
                        fontWeight: "bold",
                      }}
                    >
                      {getStatusLabel(instructor.status)}
                    </Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Typography variant="body1">
                      <strong>Email:</strong> {instructor.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Kinh nghiệm:</strong> {instructor.experience} năm
                    </Typography>
                    <Typography variant="body1">
                      <strong>Trình độ:</strong> {instructor.education}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Thông tin chi tiết */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ marginTop: 4 }}
              >
                <Card
                  elevation={2}
                  sx={{ flex: 1, padding: 2, borderRadius: 2 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Giới thiệu bản thân
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />
                    <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                      {instructor.bio}
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  elevation={2}
                  sx={{ flex: 1, padding: 2, borderRadius: 2 }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Chuyên môn
                    </Typography>
                    <Divider sx={{ marginY: 1 }} />
                    <Typography variant="body1">
                      {instructor.expertise}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* Tài liệu chứng chỉ */}
              <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Tài liệu chứng chỉ
                </Typography>
                <Divider sx={{ marginY: 1 }} />
                <iframe
                  src={`https://docs.google.com/viewer?url=${instructor.certificages}&embedded=true`}
                  width="100%"
                  height="600px"
                  style={{ border: "none", borderRadius: 8 }}
                ></iframe>
              </Box>

              {/* Rating và Review */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ marginTop: 4 }}
              >
                {instructor.rating !== null && (
                  <Card
                    elevation={2}
                    sx={{ flex: 1, padding: 2, borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Đánh giá
                      </Typography>
                      <Divider sx={{ marginY: 1 }} />
                      <Typography variant="body1">
                        {instructor.rating} / 5
                      </Typography>
                    </CardContent>
                  </Card>
                )}
                {instructor.review && (
                  <Card
                    elevation={2}
                    sx={{ flex: 1, padding: 2, borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Nhận xét
                      </Typography>
                      <Divider sx={{ marginY: 1 }} />
                      <Typography variant="body1">
                        {instructor.review}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <StyledDialogActions>
          {/* Nếu đang từ chối, hiển thị trường nhập lý do */}
          {isRejecting && (
            <TextField
              fullWidth
              label="Lý do từ chối"
              variant="outlined"
              multiline
              rows={3}
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (e.target.value.trim().length >= 10) {
                  setReasonError(false);
                }
              }}
              error={reasonError}
              helperText={
                reasonError ? "Lý do từ chối phải ít nhất 10 ký tự." : ""
              }
              sx={{ marginBottom: 2 }}
            />
          )}
          <Stack direction="row" spacing={2}>
            {/* Nút Duyệt */}
            {!isRejecting && (
              <Button
                onClick={handleApprove}
                variant="contained"
                color="success"
                disabled={loading || instructor?.status === "active"}
                startIcon={<CheckCircleIcon />}
                sx={{
                  width: 150,
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                {loading ? "Đang xử lý..." : "Duyệt"}
              </Button>
            )}
            {/* Nút Từ chối */}
            {!isRejecting && (
              <Button
                onClick={handleRejectClick}
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                sx={{
                  width: 150,
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                Từ chối
              </Button>
            )}
            {/* Nút Xác nhận từ chối */}
            {isRejecting && (
              <Button
                onClick={handleConfirmReject}
                variant="contained"
                color="error"
                disabled={loading}
                startIcon={<CancelIcon />}
                sx={{
                  width: 200,
                  textTransform: "none",
                  fontWeight: "bold",
                  borderRadius: 2,
                }}
              >
                {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
              </Button>
            )}
            {/* Nút Đóng */}
            <Button
              onClick={handleClose}
              variant="outlined"
              color="primary"
              sx={{
                width: 120,
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              Đóng
            </Button>
          </Stack>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default DetailInstructor;
