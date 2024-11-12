import React, { useState, useEffect } from "react";
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
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    DialogContentText,
    Typography,

} from "@mui/material";
import { MoreVert, Search, Close } from "@mui/icons-material";
import BaseCard from "@/components/shared/DashboardCard";
import { string } from "yup";

type Instructor = {
    avt: string;
    fullName: string;
    email: string;
    expertise: string;
    experience: string;
    education: string;
    status: string;
};

const InstructorInfoTable = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isRejecting, setIsRejecting] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const fetchInstructors = async (status: string, searchTerm: string) => {
        try {
            let url = `http://localhost:8080/api/v1/instructor`;

            const queryParams: Array<{ [key: string]: string }> = [];

            if (status && status !== "all") {
                queryParams.push({ status });
            }

            if (searchTerm && searchTerm.trim() !== "") {
                queryParams.push({ fullName: searchTerm });
            }

            if (queryParams.length > 0) {
                const queryString = queryParams
                    .map(item => {
                        const [key, value] = Object.entries(item)[0];
                        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                    })
                    .join("&");

                url = `${url}?${queryString}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();

                if (Array.isArray(data.message)) {
                    const filteredInstructors = data.message.map((instr: any) => ({
                        avt: instr.avt,
                        fullName: instr.fullName,
                        email: instr.email,
                        expertise: instr.expertise,
                        experience: instr.experience,
                        education: instr.education,
                        status: instr.status,
                    }));
                    setInstructors(filteredInstructors);
                } else {
                    console.error("Data returned is not an array:", data);
                }
            } else {
                console.error("Failed to fetch instructors");
            }
        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
    };



    useEffect(() => {
        fetchInstructors(filterStatus, searchTerm);
    }, [filterStatus, searchTerm]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilterStatus(event.target.value as string);
    };
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, instructor: Instructor) => {
        setAnchorEl(event.currentTarget);
        setSelectedInstructor(instructor);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedInstructor(null);
    };

    const handleActionClick = (action: string) => {
        if (action === "Duyệt đơn") {
            setOpenDialog(true);
        }
        handleMenuClose();
    };

    const handleDialogClose = (decision: string) => {
        if (decision === "Từ chối" && !rejectionReason.trim()) {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }

        setOpenDialog(false);
        setRejectionReason("");
    };

    const getStatusColor = (status: string) => {
        return status === "active" ? "#6fbf73" : "#ff9800";
    };
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    return (
        <BaseCard title="Danh sách Giảng viên">
            <>
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
                ></TableContainer>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Avatar</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Expertise</TableCell>
                                <TableCell align="right">Experience</TableCell>
                                <TableCell align="left">Education</TableCell>
                                <TableCell align="right">
                                    <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                                        <InputLabel>Status</InputLabel>
                                        <Select value={filterStatus} onChange={handleFilterChange} label="Status">
                                            <MenuItem value="all">All</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {instructors.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((instr, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">
                                        <Box display="flex" alignItems="center">
                                            <img src={instr.avt} alt="avatar" width="40" height="40" style={{ borderRadius: "50%" }} />
                                        </Box>
                                    </TableCell>
                                    <TableCell>{instr.fullName}</TableCell>
                                    <TableCell>{instr.email}</TableCell>
                                    <TableCell>{instr.expertise}</TableCell>
                                    <TableCell align="right">{instr.experience}</TableCell>
                                    <TableCell>{instr.education}</TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" sx={{ color: getStatusColor(instr.status), fontWeight: "bold" }}>
                                            {instr.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={(e) => handleMenuOpen(e, instr)}>
                                            <MoreVert />
                                        </IconButton>
                                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                            <MenuItem
                                                onClick={() => handleActionClick("Duyệt đơn")}
                                                disabled={instr.status === "Active"}
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
                    count={instructors.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />

                {/* Dialog xác nhận duyệt đơn */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Xác nhận Duyệt đơn</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn duyệt đơn này?
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
                        <Button onClick={() => handleDialogClose("Đồng ý")} color="primary">
                            Đồng ý
                        </Button>
                        <Button onClick={() => setIsRejecting(true)} color="error">
                            Từ chối
                        </Button>
                        <Button onClick={() => setOpenDialog(false)} color="error">
                            Hủy
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        </BaseCard>

    );
};

export default InstructorInfoTable;
