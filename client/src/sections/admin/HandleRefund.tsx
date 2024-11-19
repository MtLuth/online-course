"use client";
import React, { useState } from "react";
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
    IconButton
} from "@mui/material";
import BaseCard from "@/components/shared/DashboardCard";
import { Visibility, Search, Close } from "@mui/icons-material";
import { getMaxListeners } from "events";


type RefundRequest = {
    email: string,
    orderCode: string;
    amount: number;
    status: string;
    date: string;
};

const RefundRequestTable = () => {
    const dummyData: RefundRequest[] = [
        {
            email: "gk@gmail.com",
            orderCode: "001234",
            amount: 405000,
            status: "InProgress",
            date: "2024-11-15",
        },
        {
            email: "gk@gmail.com",
            orderCode: "001235",
            amount: 299000,
            status: "Complete",
            date: "2024-11-14",
        },
        {
            email: "gk@gmail.com",
            orderCode: "001236",
            amount: 159000,
            status: "Reject",
            date: "2024-11-13",
        },
        {
            email: "gk@gmail.com",
            orderCode: "001237",
            amount: 509000,
            status: "InProgress",
            date: "2024-11-12",
        },
        {
            email: "gk@gmail.com",
            orderCode: "001238",
            amount: 750000,
            status: "Complete",
            date: "2024-11-11",
        },
        {
            email: "gk@gmail.com",
            orderCode: "001239",
            amount: 180000,
            status: "Reject",
            date: "2024-11-10",
        },
    ];

    const [filterStatus, setFilterStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const total = dummyData.length;

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

    const filteredData =
        filterStatus === "all"
            ? dummyData
            : dummyData.filter((request) => request.status === filterStatus);

    const paginatedData = filteredData.slice(
        (page - 1) * limit,
        page * limit
    );


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
                                <TableCell>
                                    {/* Combobox Filter */}
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
                                <TableCell>Ngày</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((request) => (
                                <TableRow key={request.orderCode}>
                                    <TableCell>{request.email}</TableCell>
                                    <TableCell>{request.orderCode}</TableCell>
                                    <TableCell>{request.amount.toLocaleString()} VND</TableCell>
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
                                    <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
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
                    count={filteredData.length}
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
