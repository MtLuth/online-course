import React, { useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    IconButton,
    TablePagination,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Menu,
    MenuItem,
    TextField,
    Typography,
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent,
} from "@mui/material";
import { MoreVert, Search, Close } from "@mui/icons-material";
import BaseCard from "@/components/shared/DashboardCard";

const instructorsData = [
    {
        email: "instructor1@gmail.com",
        avt: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png",
        experience: 3,
        expertise: "JavaScript",
        education: "UTE",
        fullName: "Instructor 1",
        status: "Active",
    },
    {
        email: "instructor2@gmail.com",
        avt: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png",
        experience: 3,
        expertise: "NextJs",
        education: "UTE",
        fullName: "Instructor 2",
        status: "Active",
    },
    {
        email: "instructor3@gmail.com",
        avt: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Breezeicons-actions-22-im-user.svg/1200px-Breezeicons-actions-22-im-user.svg.png",
        experience: 3,
        expertise: "Python",
        education: "UTE",
        fullName: "Instructor 3",
        status: "Pending",
    },
];

const InstructorInfoTable = () => {
    const [instructors, setInstructors] = useState(instructorsData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, email: string, status: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedEmail(email);
        setSelectedStatus(status);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleApproveRequest = () => {
        setOpenDialog(true);
        setIsRejecting(false);
        handleMenuClose();
    };

    const handleDialogClose = (decision: string) => {
        if (decision === "rejected" && rejectionReason.trim() === "") {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }
        setInstructors((prev) =>
            prev.map((instr) =>
                instr.email === selectedEmail
                    ? { ...instr, status: decision === "approved" ? "Active" : instr.status }
                    : instr
            )
        );
        setOpenDialog(false);
        setSelectedEmail(null);
        setRejectionReason("");
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status: string) => {
        return status === "Active" ? "#6fbf73" : "#ff9800";
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilterStatus(event.target.value);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Filter instructors based on the selected status and search term
    const filteredInstructors = instructors.filter((instr) =>
        (filterStatus === "All" || instr.status === filterStatus) &&
        (instr.fullName.toLowerCase().includes(searchTerm) ||
            instr.email.toLowerCase().includes(searchTerm) ||
            instr.expertise.toLowerCase().includes(searchTerm) ||
            instr.education.toLowerCase().includes(searchTerm))
    );

    return (
        <BaseCard title="Danh sách Giảng viên">
            <React.Fragment>
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                    {showSearch ? (
                        <TextField
                            label="Tìm kiếm"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tên, email, chuyên môn hoặc nơi công tác"
                            sx={{ width: '60%' }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => { setShowSearch(false); setSearchTerm(""); }}>
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
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: 10,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        width: {
                            xs: "274px",
                            sm: "100%",
                        },
                    }}
                >
                    <Table
                        aria-label="simple table"
                        sx={{
                            whiteSpace: "nowrap",
                            mt: 2,
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>Avatar</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Expertise</TableCell>
                                <TableCell>Experience</TableCell>
                                <TableCell>Education</TableCell>
                                <TableCell align="right">
                                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={filterStatus}
                                            onChange={handleFilterChange}
                                            label="Status"
                                        >
                                            <MenuItem value="All">All</MenuItem>
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Pending">Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredInstructors
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((instr, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <img
                                                    src={instr.avt}
                                                    alt="avatar"
                                                    width="40"
                                                    height="40"
                                                    style={{ borderRadius: "50%" }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>{instr.fullName}</TableCell>
                                        <TableCell>{instr.email}</TableCell>
                                        <TableCell>{instr.expertise}</TableCell>
                                        <TableCell>{instr.experience} years</TableCell>
                                        <TableCell>{instr.education}</TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: getStatusColor(instr.status),
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {instr.status}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={(e) => handleMenuOpen(e, instr.email, instr.status)}
                                            >
                                                <MoreVert />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleMenuClose}
                                            >
                                                <MenuItem
                                                    onClick={handleApproveRequest}
                                                    disabled={selectedStatus !== "Pending"}
                                                >
                                                    Duyệt đơn
                                                </MenuItem>
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredInstructors.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                >
                    <DialogTitle>Xác nhận Duyệt đơn</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {isRejecting
                                ? "Vui lòng nhập lý do từ chối đơn của giảng viên."
                                : "Bạn có chắc muốn duyệt đơn này không?"}
                        </DialogContentText>
                        {isRejecting && (
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Lý do từ chối"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => handleDialogClose(isRejecting ? "rejected" : "approved")}
                            color="primary"
                        >
                            {isRejecting ? "Xác nhận Từ chối" : "Đồng ý"}
                        </Button>
                        {!isRejecting && (
                            <Button
                                onClick={() => setIsRejecting(true)}
                                color="error"
                            >
                                Từ chối
                            </Button>
                        )}
                        <Button onClick={() => setOpenDialog(false)} color="error">
                            Hủy
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        </BaseCard>
    );
};

export default InstructorInfoTable;
