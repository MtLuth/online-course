"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    TablePagination,
    Paper,
    Typography,
    Select,
    MenuItem,
    SelectChangeEvent,
    IconButton,
    FormControl,
    InputLabel,
    TextField
} from "@mui/material";
import BaseCard from "@/components/shared/DashboardCard";
import { Visibility, Search, Close } from "@mui/icons-material";
import { useAppContext } from "@/context/AppContext";
import DetailRequest from "@/sections/admin/DetailRequest";


type RefundRequest = {
    id: string;
    email: string;
    orderCode: string;
    amount: number;
    status: string;
    date: string;
};

const RefundRequestTable = () => {
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const { sessionToken } = useAppContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);


    const fetchRefundRequests = async () => {
        try {
            const queryParams = new URLSearchParams();
            // queryParams.set("page", page.toString());
            // queryParams.set("limit", limit.toString());

            if (filterStatus !== "all") {
                queryParams.set("status", filterStatus);
            }

            const url = `http://localhost:8080/api/v1/refund?${queryParams.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const { results, itemCount } = data.message;

                const transformedResults = results.map((item: any) => ({
                    id: item.id,
                    email: item.email,
                    orderCode: item.orderCode,
                    amount: item.amount,
                    status: item.status,
                    date: new Date(item.date).toLocaleDateString("vi-VN"),
                }));

                setRefundRequests(transformedResults);
                setTotal(itemCount);
            } else {
                console.error("Failed to fetch data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching refund requests:", error);
        }
    };

    useEffect(() => {
        fetchRefundRequests();
    }, [page, limit, filterStatus]);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleFilterStatusChange = (event: SelectChangeEvent) => {
        setFilterStatus(event.target.value);
        setPage(1);
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleOpenDetailDialog = (id: string) => {
        setSelectedRequestId(id);
        setOpenDetailDialog(true);
    };

    const handleCloseDetailDialog = () => {
        setOpenDetailDialog(false);
        setSelectedRequestId(null);
    };

    return (
        <BaseCard>
            <>
                <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "24px",
                            color: "#2c3e50",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Danh sách Yêu cầu hoàn tiền
                    </Typography>
                </Box>
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    {showSearch ? (
                        <TextField
                            label="Tìm kiếm"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo email hoặc mã đơn hàng"
                            sx={{ width: "60%" }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => { setShowSearch(false); setSearchTerm(""); setPage(1); }}
                                    >
                                        <Close />
                                    </IconButton>
                                ),
                            }}
                        />
                    ) : (
                        <IconButton onClick={() => setShowSearch(true)}>
                            <Search />
                        </IconButton>
                    )}
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Mã đơn hàng</TableCell>
                                <TableCell>Số tiền</TableCell>
                                <TableCell>Ngày</TableCell>
                                <TableCell align="right">
                                    <FormControl variant="outlined" size="small">
                                        <InputLabel>Trạng thái</InputLabel>
                                        <Select
                                            value={filterStatus}
                                            onChange={handleFilterStatusChange}
                                            label="Trạng thái"
                                            autoWidth
                                        >
                                            <MenuItem value="all">Tất cả</MenuItem>
                                            <MenuItem value="InProgress">Đã chấp nhận</MenuItem>
                                            <MenuItem value="InProgress">Đang xử lý</MenuItem>
                                            <MenuItem value="Complete">Đã hoàn tiền</MenuItem>
                                            <MenuItem value="Reject">Từ chối</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {refundRequests.map((request) => (
                                <TableRow key={request.orderCode}>
                                    <TableCell>{request.email}</TableCell>
                                    <TableCell>{request.orderCode}</TableCell>
                                    <TableCell>{request.amount.toLocaleString()} VND</TableCell>
                                    <TableCell>{request.date}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color:
                                                    request.status === "Đã hoàn tiền"
                                                        ? "#28a745" // Xanh lá cây
                                                        : request.status === "Đang xử lý"
                                                            ? "#ff9800" // Cam
                                                            : request.status === "Hệ thống từ chối"
                                                                ? "#dc3545" // Đỏ
                                                                : "#757ce8",

                                                fontWeight: "bold",
                                            }}
                                        >
                                            {request.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => handleOpenDetailDialog(request.id)}
                                            aria-label="Xem chi tiết"
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={total}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPage={limit}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    showFirstButton
                    showLastButton
                />
                <DetailRequest
                    open={openDetailDialog}
                    requestId={selectedRequestId}
                    onClose={handleCloseDetailDialog}
                />
            </>
        </BaseCard>
    );
};

export default RefundRequestTable;
