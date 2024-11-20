import React from "react";
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
} from "@mui/material";

type DetailIncomeDialogProps = {
    open: boolean;
    onClose: () => void;
    record: {
        uid: string;
        courseTitle: string;
        orderCode: string;
        amount: number;
        date: string;
        status: string;
    } | null;
};

const DetailIncomeDialog: React.FC<DetailIncomeDialogProps> = ({ open, onClose, record }) => {
    if (!record) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontSize: "4.5rem",
                    fontWeight: "bold",
                }}
            >
                Chi tiết thu nhập
            </DialogTitle>
            <DialogContent>
                <Box sx={{ padding: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Thông tin khóa học
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={7}>
                            <TextField
                                fullWidth
                                label="Khóa học"
                                value={record.courseTitle}
                                variant="outlined"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                fullWidth
                                label="Mã đơn hàng"
                                value={record.orderCode}
                                variant="outlined"
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Thông tin giao dịch
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Số tiền (VND)"
                                    value={record.amount.toLocaleString()}
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày"
                                    value={record.date}
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Trạng thái"
                                    value={record.status}
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetailIncomeDialog;
