"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Toolbar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import { Visibility, Search, Close } from "@mui/icons-material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DetailInstructor from "@/sections/admin/DetailInstructors";
import { instructorApi } from "@/server/Instructor";
import { styled } from "@mui/system";

// Tùy chỉnh các thành phần để cải thiện giao diện
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2, 2, 0, 0),
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

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

type InstructorDetail = {
  id: string;
  expertise: string;
  bio: string;
  certificages: string;
  education: string;
  experience: string;
  rating: number | null;
  review: number | null;
  fullName: string;
  email: string;
  avt: string;
  status: string;
};

const InstructorInfoTable = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(0); // DataGrid page starts from 0
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructorDetail, setSelectedInstructorDetail] =
    useState<InstructorDetail | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", (page + 1).toString()); // API page starts from 1
        queryParams.set("limit", limit.toString());
        if (filterStatus !== "all") queryParams.set("status", filterStatus);
        if (searchTerm.trim()) queryParams.set("searchParam", searchTerm);

        const response = await fetch(
          `http://localhost:8080/api/v1/instructor?${queryParams.toString()}`
        );
        if (response.ok) {
          const data = await response.json();
          const instructorsWithUid = data.message.results.map((instr: any) => ({
            uid: instr.id,
            ...instr,
          }));
          setInstructors(instructorsWithUid);
          setTotal(data.message.itemCount ?? 0);
        } else {
          console.error("Failed to fetch instructors:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchInstructors();
  }, [page, limit, filterStatus, searchTerm]);

  const handleViewDetails = async (uid: string) => {
    try {
      const response = await instructorApi.getOne(uid);
      if (response.status === "Successfully") {
        const instructor = response.message.instructor;
        setSelectedInstructorDetail(instructor);
        setOpenDetailDialog(true);
      } else {
        console.error("Failed to fetch instructor details");
      }
    } catch (error) {
      console.error("Error fetching instructor details:", error);
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedInstructorDetail(null);
  };

  const getStatusChip = (status: string) => {
    let color: "default" | "success" | "warning" | "error" = "default";
    let label;
    switch (status) {
      case "active":
        color = "success";
        label = "Hoạt động";
        break;
      case "pending":
        color = "warning";
        label = "Chờ duyệt";
        break;
      case "inactive":
        color = "error";
        label = "Chưa kích hoạt";
        break;
      default:
        color = "default";
        label = status;
    }
    return <Chip label={label} color={color} size="small" />;
  };

  const columns: GridColDef[] = [
    {
      field: "avt",
      headerName: "Avatar",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt={params.row.fullName}
          sx={{ width: 40, height: 40 }}
        />
      ),
    },
    {
      field: "fullName",
      headerName: "Họ và tên",
      flex: 1,
      minWidth: 250,
      sortable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
      sortable: true,
    },
    {
      field: "expertise",
      headerName: "Chuyên môn",
      flex: 1,
      minWidth: 250,
      sortable: true,
    },
    {
      field: "education",
      headerName: "Học vấn",
      flex: 1,
      minWidth: 250,
      sortable: true,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 130,
      sortable: true,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 120,
      renderCell: (params) => (
        <Tooltip title="Xem chi tiết">
          <IconButton
            onClick={() => handleViewDetails(params.row.uid)}
            aria-label="Xem chi tiết"
          >
            <Visibility />
          </IconButton>
        </Tooltip>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <StyledPaper>
      {/* Tiêu đề với nền màu sắc và icon */}
      <HeaderBox>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Danh sách Chuyên Gia
        </Typography>
        <Typography variant="subtitle1">
          Quản lý và xem thông tin chi tiết về các Chuyên Gia
        </Typography>
      </HeaderBox>

      {/* Thanh công cụ tìm kiếm và lọc */}
      <StyledToolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Tìm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" />,
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <Close />
                  </IconButton>
                ),
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Trạng thái"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                }}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="pending">Chờ duyệt</MenuItem>
                <MenuItem value="inactive">Chưa kích hoạt</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledToolbar>

      {/* Bảng dữ liệu giảng viên */}
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={instructors}
          columns={columns}
          pageSize={limit}
          rowsPerPageOptions={[5, 10, 20, 50]} // Đã thêm 50 vào tùy chọn
          pagination
          paginationMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newLimit) => setLimit(newLimit)}
          rowCount={total}
          getRowId={(row) => row.uid}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fafafa",
            },
          }}
        />
      </Box>

      {/* Dialog chi tiết giảng viên */}
      {selectedInstructorDetail && (
        <DetailInstructor
          open={openDetailDialog}
          instructor={selectedInstructorDetail}
          onClose={handleCloseDetailDialog}
          onUpdate={() => setPage(0)}
        />
      )}
    </StyledPaper>
  );
};

export default InstructorInfoTable;
