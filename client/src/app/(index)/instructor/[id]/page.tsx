"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Modal,
  IconButton,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useParams } from "next/navigation";
import { instructorApi } from "@/server/Instructor";
import { Close as CloseIcon } from "@mui/icons-material";

const InstructorProfilePage = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<any>(null); // Instructor data
  const [courses, setCourses] = useState<any[]>([]); // Instructor's courses
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [page, setPage] = useState(1); // Current page for pagination
  const [pageSize, setPageSize] = useState(5); // Number of courses per page
  const [openModal, setOpenModal] = useState(false); // Modal for certificate
  const [certificateUrl, setCertificateUrl] = useState(""); // Certificate URL for iframe

  useEffect(() => {
    const fetchInstructorData = async () => {
      setLoading(true);
      try {
        const response = await instructorApi.getOne(id as string);
        if (response.status === "Successfully") {
          setInstructor(response.message.instructor);
          setCourses(response.message.courses);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [id]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPageSize(event.target.value as number);
    setPage(1); // Reset to first page on page size change
  };

  const handleCertificateOpen = (url: string) => {
    setCertificateUrl(url);
    setOpenModal(true);
  };

  const handleCertificateClose = () => setOpenModal(false);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!instructor) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        Instructor not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      {/* Instructor Info */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar
          src={instructor.avt || "/avatar-placeholder.png"}
          alt={instructor.fullName}
          sx={{ width: 120, height: 120, margin: "0 auto", mb: 2 }}
        />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {instructor.fullName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {instructor.expertise}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {instructor.bio}
        </Typography>

        {/* Instructor Additional Info */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 3 }}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              <strong>Education: </strong> {instructor.education}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Experience: </strong> {instructor.experience} years
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="textSecondary">
              <strong>Email: </strong> {instructor.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Status: </strong> {instructor.status}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          sx={{ mt: 3 }}
          onClick={() => handleCertificateOpen(instructor.certificages)}
        >
          Xem Chứng Chỉ
        </Button>
      </Box>

      {/* Instructor's Courses Section */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Các Khóa Học Của Chuyên Gia
      </Typography>

      {/* Page Size Selector */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="page-size-select-label">Số lượng</InputLabel>
          <Select
            labelId="page-size-select-label"
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Số lượng"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {courses.slice((page - 1) * pageSize, page * pageSize).map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                boxShadow: 6,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 12,
                  transform: "translateY(-5px)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={course.thumbnail}
                alt={course.title}
                sx={{
                  objectFit: "cover",
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {course.description.length > 100
                    ? `${course.description.substring(0, 100)}...`
                    : course.description}
                </Typography>

                {/* Course Level */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip
                    label={`Cấp độ: ${course.level}`}
                    variant="outlined"
                    color="primary"
                  />
                  <Chip
                    label={`Giá: ${course.salePrice.toLocaleString()} VND`}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>

              {/* Start Course Button */}
              <Box sx={{ padding: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    fontSize: "1rem",
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() =>
                    console.log(`Start course with ID: ${course.id}`)
                  }
                >
                  Đăng Ký
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(courses.length / pageSize)}
          page={page}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Modal for Viewing Certificate */}
      <Modal open={openModal} onClose={handleCertificateClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            backgroundColor: "white",
            boxShadow: 24,
            padding: 2,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <IconButton
            onClick={handleCertificateClose}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            src={`https://docs.google.com/viewer?url=${certificateUrl}&embedded=true`}
            width="100%"
            height="100%"
            frameBorder="0"
          ></iframe>
        </Box>
      </Modal>
    </Box>
  );
};

export default InstructorProfilePage;
