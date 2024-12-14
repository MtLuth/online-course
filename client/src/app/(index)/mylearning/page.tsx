"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAppContext } from "@/context/AppContext";
import { useToastNotification } from "@/hook/useToastNotification";
import { useRouter } from "next/navigation";
import { myLearningApi } from "@/server/MyLearning";

interface Course {
  courseId: string;
  title: string;
  price: number;
  salePrice?: number;
  description: string;
  thumbnail: string;
  level: string;
  instructor: string;
}

const getLevelLabel = (level: string) => {
  switch (level) {
    case "Beginner":
      return "Người mới";
    case "Intermediate":
      return "Trung cấp";
    case "Advanced":
      return "Nâng cao";
    default:
      return "Chưa xác định";
  }
};

const MyLearning: React.FC = () => {
  const { sessionToken } = useAppContext();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchParam, setSearchParam] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useToastNotification();
  const router = useRouter();

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch my learnings based on searchParam
  useEffect(() => {
    const fetchMyLearnings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!sessionToken) {
          setError("Vui lòng đăng nhập lại.");
          setCourses([]);
          return;
        }

        const response = await myLearningApi.getMyLearnings(sessionToken, {
          searchParam: searchParam.trim() !== "" ? searchParam : undefined,
        });

        if (response.status !== "Successfully") {
          throw new Error(response.message || "Lỗi khi lấy dữ liệu.");
        }

        setCourses(response.message || []);
        setCurrentPage(1); // Reset to first page on new fetch
      } catch (err: any) {
        console.error("Error fetching my learnings:", err);
        setError(
          err.message || "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau."
        );
        notifyError("Lỗi khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyLearnings();
  }, [searchParam]);

  // Update total pages whenever courses or itemsPerPage change
  useEffect(() => {
    setTotalPages(Math.ceil(courses.length / itemsPerPage) || 1);
  }, [courses, itemsPerPage]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParam(searchInput); // Update searchParam to trigger useEffect
  };

  // Handle starting a course
  const handleStartCourse = (courseId: string) => {
    router.push(`/course/${courseId}/player`);
  };

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setItemsPerPage(event.target.value as number);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Calculate the courses to display on the current page
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "60vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          padding: 2,
          backgroundColor: "#f4f4f4",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        Các Khóa Học Của Tôi
      </Typography>

      {/* Search Form */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Tìm kiếm khóa học"
          variant="outlined"
          fullWidth
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit(e);
            }
          }}
          sx={{
            maxWidth: "500px",
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: 6,
            },
            "& .MuiOutlinedInput-root": {
              transition: "all 0.3s ease",
              "&:hover fieldset": {
                borderColor: "#1976d2", // Màu border khi hover
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            height: "100%",
            borderRadius: 2,
            boxShadow: 3,
            fontSize: "1rem",
            padding: "12px 20px",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: 6,
              transform: "scale(1.05)",
            },
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* Display Error Message */}
      {error && (
        <Typography
          variant="body1"
          color="error"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {error}
        </Typography>
      )}

      {/* Display Loading Spinner */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ textAlign: "center" }}
        >
          Không tìm thấy khóa học nào phù hợp.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="items-per-page-label">Hiển thị</InputLabel>
              <Select
                labelId="items-per-page-label"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                label="Hiển thị"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            {/* Pagination Controls */}
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>

          {/* Courses Grid */}
          <Grid container spacing={3}>
            {currentCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.courseId}>
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
                    height="200"
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

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={`Cấp độ: ${getLevelLabel(course.level)}`}
                        variant="outlined"
                        sx={{
                          fontSize: "0.85rem",
                          backgroundColor: "#f0f0f0",
                        }}
                      />
                    </Box>
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
                      onClick={() => handleStartCourse(course.courseId)}
                    >
                      Bắt đầu khóa học
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default MyLearning;
