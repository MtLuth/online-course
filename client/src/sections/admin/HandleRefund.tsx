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
    IconButton,
    FormControl,
    InputLabel,
    TextField,
    Menu,
    MenuItem as MuiMenuItem,
    SelectChangeEvent
} from "@mui/material";
import BaseCard from "@/components/shared/DashboardCard";
import { MoreVert, Search, Close } from "@mui/icons-material";
import { useAppContext } from "@/context/AppContext";
import DetailRequest from "@/sections/admin/DetailRequest";
import UpdateRequestDialog from "@/sections/admin/UpdateRequest";

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
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMenuRequest, setSelectedMenuRequest] = useState<RefundRequest | null>(null);

    const [openEditStatusDialog, setOpenEditStatusDialog] = useState(false);
    const [updatedStatus, setUpdatedStatus] = useState("");


    const fetchRefundRequests = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.set("page", page.toString());
            queryParams.set("limit", limit.toString());

            if (filterStatus !== "all") {
                queryParams.set("status", filterStatus);
            }
            if (searchTerm.trim()) {
                queryParams.set("searchParam", searchTerm.trim());
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

                setRefundRequests(
                    results.map((item: any) => ({
                        id: item.id,
                        email: item.email,
                        orderCode: item.orderCode,
                        amount: item.amount,
                        status: item.status,
                        date: new Date(item.date).toLocaleDateString("vi-VN"),
                    }))
                );
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
    }, [page, limit, filterStatus, searchTerm]);

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

    const handleFilterStatusChange = (event: SelectChangeEvent<string>) => {
        setFilterStatus(event.target.value);
        setPage(1);
    };

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, request: RefundRequest) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedMenuRequest(request);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
        setSelectedMenuRequest(null);
    };

    const handleOpenDetailDialog = () => {
        if (selectedMenuRequest) {
            setSelectedRequestId(selectedMenuRequest.id);
            setOpenDetailDialog(true);
        }
        handleCloseMenu();
    };

    const handleEditStatus = () => {
        if (selectedMenuRequest) {
            console.log("Chỉnh sửa trạng thái cho yêu cầu:", selectedMenuRequest);
            // Logic chỉnh sửa trạng thái ở đây
        }
        handleCloseMenu();
    };

    const handleCloseDetailDialog = () => {
        setOpenDetailDialog(false);
        setSelectedRequestId(null);
    };

    const handleOpenEditStatusDialog = () => {
        if (selectedMenuRequest) {
            setUpdatedStatus(selectedMenuRequest.status);
            setOpenEditStatusDialog(true);
        }
        handleCloseMenu();
    };

    const handleCloseEditStatusDialog = () => {
        setOpenEditStatusDialog(false);
    };

    const handleSaveStatus = async () => {
        if (selectedMenuRequest) {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/refund/${selectedMenuRequest.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionToken}`,
                        },
                        body: JSON.stringify({ status: updatedStatus }),
                    }
                );

                if (response.ok) {
                    console.log("Status updated successfully");
                    fetchRefundRequests();
                } else {
                    console.error("Failed to update status");
                }
            } catch (error) {
                console.error("Error updating status:", error);
            }
        }
        handleCloseEditStatusDialog();
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm theo email hoặc mã đơn hàng"
                            sx={{ width: "60%" }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => {
                                            setShowSearch(false);
                                            setSearchTerm("");
                                            setPage(1);
                                        }}
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
                                            <MenuItem value="Accepted">Đã chấp nhận</MenuItem>
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
                                <TableRow key={request.id}>
                                    <TableCell>{request.email}</TableCell>
                                    <TableCell>{request.orderCode}</TableCell>
                                    <TableCell>{request.amount.toLocaleString()} VND</TableCell>
                                    <TableCell>{request.date}</TableCell>
                                    <TableCell align="right">
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color:
                                                    request.status === "Đã hoàn tiền"
                                                        ? "#28a745"
                                                        : request.status === "Đang xử lý"
                                                            ? "#ff9800"
                                                            : "#dc3545",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {request.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={(e) => handleOpenMenu(e, request)}
                                            aria-label="Menu"
                                        >
                                            <MoreVert />
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
                <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <MuiMenuItem onClick={handleOpenDetailDialog}>Xem chi tiết</MuiMenuItem>
                    <MuiMenuItem onClick={handleOpenEditStatusDialog}>Cập nhật</MuiMenuItem>
                </Menu>
                <DetailRequest
                    open={openDetailDialog}
                    requestId={selectedRequestId}
                    onClose={handleCloseDetailDialog}
                />
                <UpdateRequestDialog
                    open={openEditStatusDialog}
                    requestId={selectedMenuRequest?.id || null}
                    onClose={handleCloseEditStatusDialog}
                    onStatusUpdate={fetchRefundRequests}
                />
            </>
        </BaseCard>
    );
};

export default RefundRequestTable;
