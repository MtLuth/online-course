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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Visibility, Search, Close } from "@mui/icons-material";
import BaseCard from "@/components/shared/DashboardCard";
import DetailInstructor from "@/sections/admin/DetailInstructors";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Instructor = {
  uid: string;
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
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [selectedInstructorDetail, setSelectedInstructorDetail] =
    useState<Instructor | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


  useEffect(() => {
    const initialPage = Number(searchParams.get('page')) || 1;
    const initialLimit = Number(searchParams.get('limit')) || 5;
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
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const instructorsWithUid = data.message.results.map((instr: any) => ({
          uid: instr.id,
          ...instr,
        }));
        setInstructors(instructorsWithUid);
        setTotal(data.message.itemCount ?? 0);
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [page, limit, filterStatus, debouncedSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);


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


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };


  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value as string);
    setPage(1);
  };


  const handleViewDetails = (instructor: Instructor) => {
    setSelectedInstructorDetail(instructor);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedInstructorDetail(null);
  };


  const handleUpdate = (uid: string, newStatus: string) => {
    setInstructors((prevInstructors) =>
      prevInstructors.map((instr) =>
        instr.uid === uid ? { ...instr, status: newStatus } : instr
      )
    );
    setOpenDetailDialog(false);
    setSelectedInstructorDetail(null);
  };

  return (
    <BaseCard>
      <>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              fontSize: '24px',
              color: '#2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Danh sách Giảng viên
          </Typography>
        </Box>
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
                <TableCell>Họ và tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Chuyên môn</TableCell>
                <TableCell>Học vấn</TableCell>
                <TableCell align="right">
                  <FormControl variant="outlined" size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={filterStatus}
                      onChange={handleFilterChange}
                      label="Trạng thái"
                      autoWidth
                    >
                      <MenuItem value="all">Tất cả</MenuItem>
                      <MenuItem value="active">Hoạt động</MenuItem>
                      <MenuItem value="pending">Chờ duyệt</MenuItem>
                      <MenuItem value="inactive">Chưa kích hoạt</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instructors.map((instr) => (
                <TableRow key={instr.uid}>
                  <TableCell>{instr.fullName}</TableCell>
                  <TableCell>{instr.email}</TableCell>
                  <TableCell>{instr.expertise}</TableCell>
                  <TableCell>{instr.education}</TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          instr.status === "active"
                            ? "#6fbf73"
                            : instr.status === "pending"
                              ? "#ff9800"
                              : "#9e9e9e",
                        fontWeight: "bold",
                      }}
                    >
                      {instr.status === "active"
                        ? "Hoạt động"
                        : instr.status === "pending"
                          ? "Chờ duyệt"
                          : "Chưa kích hoạt"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleViewDetails(instr)}
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
        <DetailInstructor
          open={openDetailDialog}
          instructor={selectedInstructorDetail}
          onClose={handleCloseDetailDialog}
          onUpdate={fetchInstructors}
        />
      </>
    </BaseCard>
  );
};

export default InstructorInfoTable;
