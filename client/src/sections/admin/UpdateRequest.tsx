import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    TextField,
    Divider,
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { useAppContext } from "@/context/AppContext";

type UpdateRequestProps = {
    open: boolean;
    requestId: string | null; // ID của request được chọn
    onClose: () => void; // Hàm đóng dialog
    onStatusUpdate: () => void; // Hàm gọi lại sau khi cập nhật trạng thái
};

const UpdateRequestDialog: React.FC<UpdateRequestProps> = ({
    open,
    requestId,
    onClose,
    onStatusUpdate,
}) => {
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState<any>(null); // Dữ liệu của request
    const [updatedStatus, setUpdatedStatus] = useState(""); // Trạng thái cập nhật
    const { sessionToken } = useAppContext();

    const fetchRequestDetails = async (id: string) => {
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
                setUpdatedStatus(data.message.status); // Cập nhật trạng thái ban đầu
            } else {
                console.error("Failed to fetch request details:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching request details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStatus = async () => {
        if (requestId) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/refund/${requestId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionToken}`,
                    },
                    body: JSON.stringify({ status: updatedStatus }),
                });

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

    useEffect(() => {
        if (open && requestId) {
            fetchRequestDetails(requestId);
        }
    }, [open, requestId]);

    if (!requestId) return null; // Nếu không có ID, không render dialog

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                Cập nhật trạng thái yêu cầu hoàn tiền
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

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={updatedStatus}
                                        onChange={(e: SelectChangeEvent<string>) =>
                                            setUpdatedStatus(e.target.value)
                                        }
                                    >
                                        <MenuItem value="Accepted">Đã chấp nhận</MenuItem>
                                        <MenuItem value="InProgress">Đang xử lý</MenuItem>
                                        <MenuItem value="Complete">Đã hoàn tiền</MenuItem>
                                        <MenuItem value="Reject">Từ chối</MenuItem>
                                    </Select>
                                </FormControl>
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
                <Button onClick={handleSaveStatus} color="success">
                    Lưu
                </Button>
                <Button onClick={onClose} color="primary">
                    Hủy
                </Button>

            </DialogActions>
        </Dialog>
    );
};

export default UpdateRequestDialog;
