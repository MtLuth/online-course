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
import { useRouter, usePathname, useSearchParams } from 'next/navigation';


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
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);;
    const [total, setTotal] = useState(0);
    const [filterStatus, setFilterStatus] = useState("all");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    const { replace } = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const initialPage = Number(searchParams.get('page')) || 1;
        const initialLimit = Number(searchParams.get('limit')) || 3;
        setPage(initialPage);
        setLimit(initialLimit);
    }, [searchParams]);

    const fetchInstructors = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.set('page', page.toString());
            queryParams.set('limit', limit.toString());
            if (filterStatus !== "all") {
                queryParams.set('status', filterStatus);
            }
            if (debouncedSearchTerm.trim()) {
                queryParams.set('searchParam', debouncedSearchTerm);
            }

            const url = `http://localhost:8080/api/v1/instructor?${queryParams.toString()}`;
            console.log("Fetch URL:", url);

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setInstructors(data.message.results ?? []);
                setTotal(data.message.itemCount ?? 10);
            } else {
                console.error("Failed to fetch data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
    };



    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);


    useEffect(() => {
        fetchInstructors();
    }, [page, limit, filterStatus, debouncedSearchTerm]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', (newPage + 1).toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setLimit(newLimit);
        setPage(1);

        const params = new URLSearchParams(searchParams.toString());
        params.set('limit', newLimit.toString());
        params.set('page', '1');
        replace(`${pathname}?${params.toString()}`);
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilterStatus(event.target.value as string);
        setPage(1);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, instructor: Instructor) => {
        setAnchorEl(event.currentTarget);
        setSelectedInstructor(instructor);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedInstructor(null);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleActionClick = (action: "Duyệt đơn" | "Từ chối") => {
        if (action === "Duyệt đơn") {
            setIsRejecting(false);
            handleOpenDialog();
        } else if (action === "Từ chối") {
            setIsRejecting(true);
            handleOpenDialog();
        }
    };

    const handleDialogClose = (decision: "Đồng ý" | "Từ chối") => {
        if (decision === "Đồng ý") {
        } else if (decision === "Từ chối" && !rejectionReason.trim()) {
            alert("Vui lòng nhập lý do từ chối.");
            return;
        }
        setOpenDialog(false);
        setRejectionReason("");
    };

    const getStatusColor = (status: string) => {
        return status === "active" ? "#6fbf73" : "#ff9800";
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
                            placeholder="Tìm theo tên"
                            sx={{ width: '60%' }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => { setShowSearch(false); setSearchTerm(""); setPage(1); }}>
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
                                <TableCell align="center">Avatar</TableCell>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Expertise</TableCell>
                                <TableCell align="right">Experience</TableCell>
                                <TableCell>Education</TableCell>
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
                            {instructors.map((instr, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">
                                        <img src={instr.avt} alt="avatar" width="40" height="40" style={{ borderRadius: "50%" }} />
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
                                            <MenuItem onClick={() => handleActionClick("Duyệt đơn")} disabled={instr.status === "Active"}>
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
                    count={total}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPage={limit}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[3, 5, 10]}
                    showFirstButton
                    showLastButton
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
