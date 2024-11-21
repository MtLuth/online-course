import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Box,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppContext } from "@/context/AppContext";

type DetailIncomeDialogProps = {
  open: boolean;
  onClose: () => void;
  record: {
    id: string;
    uid: string;
    courseTitle: string;
    orderCode: string;
    amount: number;
    date: string;
    status: string;
  } | null;
};

const DetailIncomeDialog: React.FC<DetailIncomeDialogProps> = ({
  open,
  onClose,
  record,
}) => {
  const [details, setDetails] = useState<{
    course: string;
    price: number;
    date: number;
    orderCode: number;
    status: string;
    amount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sessionToken } = useAppContext();

  useEffect(() => {
    const fetchIncomeDetails = async () => {
      if (open && record) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/income/${record.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch income details");
          }

          const data = await response.json();
          setDetails(data.message);
        } catch (err: any) {
          setError(err.message || "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchIncomeDetails();
  }, [open, record]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "100%", // Chiều rộng dialog
          maxWidth: "850px", // Chiều rộng tối đa
          height: "55vh", // Chiều cao dialog
        },
      }}
    >
      <DialogTitle>Chi tiết thu nhập</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ textAlign: "center", padding: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : details ? (
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin khóa học
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Khóa học"
                  value={details.course}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Trạng thái"
                  value={details.status}
                  InputProps={{
                    readOnly: true,
                    style: {
                      fontWeight: "bold",
                      color:
                        details.status === "Đã hoàn tiền"
                          ? "green"
                          : details.status === "Đang xử lý"
                          ? "orange"
                          : details.status === "Đã xử lý xong"
                          ? "blue"
                          : "inherit",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Giá (VND)"
                  value={details.price.toLocaleString()}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Số tiền nhận được (VND)"
                  value={details.amount.toLocaleString()}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Ngày"
                  value={new Date(details.date).toLocaleDateString("vi-VN")}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mã đơn hàng"
                  value={details.orderCode}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography align="center">Không có dữ liệu</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailIncomeDialog;
