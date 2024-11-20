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
  Divider,
  Tooltip,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { instructorApi } from "@/server/Instructor";
import { Close as CloseIcon, Star, School } from "@mui/icons-material";
import { styled } from "@mui/system";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: "0 auto",
  boxShadow: theme.shadows[4],
}));

const CertificateButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: theme.palette.primary.main,
  borderColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

const InstructorProfilePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [instructor, setInstructor] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [openModal, setOpenModal] = useState(false);
  const [certificateUrl, setCertificateUrl] = useState("");

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPageSize(event.target.value as number);
    setPage(1);
  };

  const handleCertificateOpen = (url: string) => {
    setCertificateUrl(url);
    setOpenModal(true);
  };

  const handleCertificateClose = () => setOpenModal(false);

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

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
        Không tìm thấy thông tin chuyên gia.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          backgroundColor: "#f5f5f5",
          padding: 4,
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <LargeAvatar
          src={instructor.avt || "/avatar-placeholder.png"}
          alt={instructor.fullName}
        />
        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
          {instructor.fullName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {instructor.expertise}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, maxWidth: 800, mx: "auto" }}>
          {instructor.bio}
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <School color="primary" />
            <Typography variant="body1">
              <strong>Học vấn:</strong> {instructor.education}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Star color="primary" />
            <Typography variant="body1">
              <strong>Kinh nghiệm:</strong> {instructor.experience} năm
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">
              <strong>Email:</strong> {instructor.email}
            </Typography>
          </Stack>
        </Box>

        <CertificateButton
          variant="outlined"
          onClick={() => handleCertificateOpen(instructor.certificages)}
        >
          Xem Chứng Chỉ
        </CertificateButton>
      </Box>

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Các Khóa Học Của Chuyên Gia
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
        }}
      >
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="page-size-select-label">Hiển thị</InputLabel>
          <Select
            labelId="page-size-select-label"
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Hiển thị"
          >
            <MenuItem value={6}>6</MenuItem>
            <MenuItem value={9}>9</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={24}>24</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {courses
          .slice((page - 1) * pageSize, page * pageSize)
          .map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={`${course.id}-${index}`}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                  cursor: "pointer",
                }}
                onClick={() => handleCourseClick(course.id)}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={course.thumbnail}
                  alt={course.title}
                  sx={{
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Tooltip title={course.title}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                      noWrap
                    >
                      {course.title}
                    </Typography>
                  </Tooltip>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {course.description.length > 1000
                      ? `${course.description.substring(0, 1000)}...`
                      : course.description}
                  </Typography>

                  {/* Course Level */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: "auto" }}
                    alignItems="center"
                  >
                    <Chip
                      label={`Cấp độ: ${course.level}`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={`Giá: ${course.salePrice.toLocaleString()} VND`}
                      size="small"
                      color="secondary"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      {courses.length > pageSize && (
        <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(courses.length / pageSize)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

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
