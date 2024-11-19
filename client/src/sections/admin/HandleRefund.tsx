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
} from "@mui/material";
import BaseCard from "@/components/shared/DashboardCard";
import { Visibility } from "@mui/icons-material";
import { useAppContext } from "@/context/AppContext";


type RefundRequest = {
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>Mã đơn hàng</TableCell>
                                <TableCell>Số tiền</TableCell>
                                <TableCell>Ngày</TableCell>
                                <TableCell>
                                    <Select
                                        value={filterStatus}
                                        onChange={handleFilterStatusChange}
                                        displayEmpty
                                        size="small"
                                        sx={{ width: "150px" }}
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        <MenuItem value="InProgress">Đang xử lý</MenuItem>
                                        <MenuItem value="Complete">Đã hoàn tiền</MenuItem>
                                        <MenuItem value="Reject">Hệ thống từ chối</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {refundRequests.map((request) => (
                                <TableRow key={request.orderCode}>
                                    <TableCell>{request.email}</TableCell>
                                    <TableCell>{request.orderCode}</TableCell>
                                    <TableCell>
                                        {request.amount.toLocaleString()} VND
                                    </TableCell>
                                    <TableCell>{request.date}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color:
                                                    request.status === "InProgress"
                                                        ? "#ff9800"
                                                        : request.status === "Complete"
                                                            ? "#6fbf73"
                                                            : "#e57373",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {request.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="Xem chi tiết">
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
            </>
        </BaseCard>
    );
};

export default RefundRequestTable;
