import { useAppContext } from "@/context/AppContext";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

type UpdateRequestProps = {
  open: boolean;
  requestId: string | null;
  requestStatus: string | null;
  onClose: () => void;
  onStatusUpdate: () => void;
};

const UpdateRequestDialog: React.FC<UpdateRequestProps> = ({
  open,
  requestId,
  requestStatus,
  onClose,
  onStatusUpdate,
}) => {
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [reason, setReason] = useState(""); // Lý do từ chối
  const [error, setError] = useState("");
  const { sessionToken } = useAppContext();
  const [action, setActionUpdate] = useState<{ key: string; value: string }[]>(
    []
  );

  useEffect(() => {
    if (requestStatus === "Đang xử lý") {
      setActionUpdate([
        { key: "Accepted", value: "Chấp nhận" },
        { key: "Reject", value: "Từ chối" },
      ]);
    } else if (requestStatus === "Đã chấp nhận") {
      setActionUpdate([{ key: "Complete", value: "Đã hoàn tiền" }]);
    }
  }, [requestStatus]);

  const handleSaveStatus = async () => {
    if (!updatedStatus) {
      setError("Vui lòng chọn trạng thái trước khi lưu.");
      return;
    }

    if (updatedStatus === "Reject" && !reason.trim()) {
      setError("Vui lòng nhập lý do từ chối.");
      return;
    }

    setError("");

    if (requestId) {
      try {
        const payload: any = { status: updatedStatus };
        if (updatedStatus === "Reject") {
          payload.reason = reason;
        }

        const response = await fetch(
          `http://localhost:8080/api/v1/refund/${requestId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.ok) {
          console.log("Status updated successfully");
          onStatusUpdate();
          onClose();
        } else {
          console.error("Failed to update status:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  if (!requestId) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        Cập nhật trạng thái yêu cầu hoàn tiền
      </DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={updatedStatus}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setUpdatedStatus(e.target.value)
                  }
                  sx={{
                    color:
                      updatedStatus === "Complete"
                        ? "#28a745"
                        : updatedStatus === "Reject"
                        ? "#dc3545"
                        : "#000",
                  }}
                >
                  {action.map((item) => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {updatedStatus === "Reject" && (
              <Grid item xs={12}>
                <TextField
                  label="Lý do từ chối"
                  variant="outlined"
                  fullWidth
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Vui lòng nhập lý do từ chối"
                />
              </Grid>
            )}
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSaveStatus} color="success">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRequestDialog;
