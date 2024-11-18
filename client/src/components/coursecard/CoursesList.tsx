// File: src/components/CoursesList.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Box,
  Typography,
  Pagination,
  Stack,
  CardContent,
  Paper,
  Button,
  TextField,
  Card,
  CardActions,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CourseCard from "./CourseCard";
import { CourseDetail } from "@/interfaces/CourseDetail";
import { useRouter } from "next/navigation";
import { categoriesApi } from "@/server/Categories";
import { getAuthToken } from "@/utils/auth";
import { courseApi } from "@/server/Cource";
import { jwtDecode } from "jwt-decode";

// Define the structure of the token payload
interface TokenPayload {
  uid: string; // Ensure this matches your token's payload
  // Add other fields if necessary
}

interface CoursesListProps {
  searchParam?: string;
  category?: string;
  isPublished?: boolean;
  orderByPrice?: string;
  showEdit?: boolean;
}

const CoursesList: React.FC<CoursesListProps> = ({
  searchParam = "",
  category = "",
  isPublished,
  orderByPrice = "asc",
  showEdit = false,
}) => {
  const router = useRouter();
  const token = getAuthToken();

  // Extract uid from token
  const [uid, setUid] = useState<string | undefined>(undefined);

  // Sử dụng useRef để tạo cờ
  const hasFetchedRef = useRef<boolean>(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUid(decoded.user_id); // Sửa lại để trích xuất đúng trường 'uid'
      } catch (error) {
        console.error("Invalid token format:", error);
        setUid(undefined);
      }
    } else {
      setUid(undefined);
    }
  }, [token, uid]);

  // Trạng thái dữ liệu khóa học
  const [courses, setCourses] = useState<CourseDetail[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [itemCount, setItemCount] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  // Trạng thái lọc và tìm kiếm
  const [localSearchParam, setLocalSearchParam] = useState<string>(searchParam);
  const [searchInput, setSearchInput] = useState<string>(searchParam); // New state for input
  const [localCategory, setLocalCategory] = useState<string>(category);
  const [localIsPublished, setLocalIsPublished] = useState<string>(
    isPublished !== undefined ? isPublished.toString() : ""
  );
  const [localOrderByPrice, setLocalOrderByPrice] =
    useState<string>(orderByPrice);

  // Trạng thái danh mục
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoadingCategories, setIsLoadingCategories] =
    useState<boolean>(false);
  const [errorCategories, setErrorCategories] = useState<string>("");

  // Trạng thái tải dữ liệu khóa học
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [errorCourses, setErrorCourses] = useState<string>("");

  // Fetch danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setErrorCategories("");
      try {
        const response = await categoriesApi.getCategories(token || "");
        if (response && response.message) {
          setCategories(response.message.results);
        } else {
          setErrorCategories("Không thể tải danh mục.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorCategories("Có lỗi xảy ra khi tải danh mục.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [token]); // Loại bỏ 'showEdit' khỏi dependencies

  // Fetch khóa học
  useEffect(() => {
    // Nếu đã gọi fetchCourses rồi, không gọi lại
    if (hasFetchedRef.current) return;

    // Điều kiện để gọi fetchCourses:
    // 1. Nếu showEdit là true, cần có token và uid đã được trích xuất
    // 2. Nếu showEdit là false, nếu uid có, gọi với uid; nếu không, gọi mà không có uid
    const shouldFetch =
      (showEdit && token && uid) || (!showEdit && (uid !== undefined || !uid));

    if (!shouldFetch) {
      // Nếu không đáp ứng điều kiện để fetch, không làm gì cả hoặc có thể set error
      if (showEdit && !token) {
        setErrorCourses("Vui lòng đăng nhập để xem các khóa học của bạn.");
      }
      return;
    }

    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      setErrorCourses("");
      try {
        let response;
        if (showEdit) {
          // Gọi API để lấy các khóa học của người dùng với uid
          response = await courseApi.getAllMyCourses(
            token,
            page,
            limit,
            localCategory,
            localSearchParam,
            localIsPublished !== "" ? localIsPublished === "true" : undefined
          );
          if (response.status === "Successfully") {
            setCourses(response.message.results);
            setItemCount(response.message.itemCount);
            setPageCount(Math.ceil(response.message.itemCount / limit));
          } else {
            setErrorCourses(
              response.message || "Không thể tải khóa học của bạn."
            );
          }
        } else {
          // Gọi API để lấy tất cả các khóa học, kèm theo uid nếu có
          response = await courseApi.getAllCourses(
            page,
            limit,
            localSearchParam,
            localCategory,
            localIsPublished !== "" ? localIsPublished === "true" : undefined,
            localOrderByPrice,
            uid // Bao gồm uid nếu có
          );
          if (response.status === "Successfully") {
            setCourses(response.message.results);
            setItemCount(response.message.itemCount);
            setPageCount(Math.ceil(response.message.itemCount / limit));
          } else {
            setErrorCourses(
              response.message || "Không thể tải tất cả các khóa học."
            );
          }
        }

        hasFetchedRef.current = true; // Đánh dấu đã gọi API thành công
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        setErrorCourses("Có lỗi xảy ra khi tải khóa học.");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [
    showEdit,
    page,
    limit,
    localSearchParam,
    localCategory,
    localIsPublished,
    localOrderByPrice,
    uid,
    token,
  ]);

  // Xử lý gửi tìm kiếm
  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLocalSearchParam(searchInput);
    setPage(1);
    hasFetchedRef.current = false; // Reset cờ để gọi lại API với tham số tìm kiếm mới
  };

  // Xử lý thay đổi trang
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    hasFetchedRef.current = false; // Reset cờ để gọi lại API với trang mới
  };

  // Xử lý thêm khóa học mới
  const handleAddCourse = () => {
    router.push("/dashboard/teacher/create-course/");
  };

  // Xử lý thay đổi limit
  const handleLimitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLimit = event.target.value as number;
    setLimit(newLimit);
    setPage(1);
    hasFetchedRef.current = false; // Reset cờ để gọi lại API với limit mới
  };

  // Xử lý thay đổi thứ tự giá
  const handleOrderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newOrder = event.target.value as string;
    setLocalOrderByPrice(newOrder);
    setPage(1);
    hasFetchedRef.current = false; // Reset cờ để gọi lại API với thứ tự mới
  };

  // Handle thay đổi tình trạng (isPublished)
  const handleIsPublishedChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newIsPublished = event.target.value as string;
    setLocalIsPublished(newIsPublished);
    setPage(1); // Reset to first page when filter changes
    hasFetchedRef.current = false; // Reset cờ để gọi lại API với filter mới
  };

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newCategory = event.target.value as string;
    setLocalCategory(newCategory);
    setPage(1);
    hasFetchedRef.current = false; // Reset cờ để gọi lại API với category mới
  };

  // Hiển thị thông báo không có khóa học
  if (!isLoadingCourses && courses.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, padding: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Không có khóa học nào để hiển thị
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          padding: 2,
          backgroundColor: "#c5c5c573",
          borderRadius: 2,
        }}
      >
        {showEdit ? "Các Khóa Học Của Tôi" : "Tất cả các Khóa Học"}
      </Typography>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box sx={{ minWidth: 250, pr: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tìm kiếm khóa học
          </Typography>

          {/* Accordion chọn số lượng hiển thị */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Hiển thị số lượng</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <InputLabel>Chọn số lượng</InputLabel>
                <Select
                  value={limit}
                  onChange={handleLimitChange}
                  label="Chọn số lượng"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          {/* Accordion chọn danh mục */}
          {!showEdit && (
            <>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Danh mục</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {isLoadingCategories ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : errorCategories ? (
                    <Typography color="error">{errorCategories}</Typography>
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel>Danh mục</InputLabel>
                      <Select
                        value={localCategory}
                        onChange={handleCategoryChange}
                        label="Danh mục"
                      >
                        <MenuItem value="">
                          <em>Tất cả</em>
                        </MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Sắp xếp theo giá</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl fullWidth>
                    <InputLabel>Sắp xếp</InputLabel>
                    <Select
                      value={localOrderByPrice}
                      onChange={handleOrderChange}
                      label="Sắp xếp theo giá"
                    >
                      <MenuItem value="asc">Giá từ thấp đến cao</MenuItem>
                      <MenuItem value="desc">Giá từ cao đến thấp</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </>
          )}

          {/* Accordion Tìm kiếm tên khóa học */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Tìm kiếm tên khóa học</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={handleSearchSubmit}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    label="Nhập tên ..."
                    value={searchInput} // Bind to searchInput
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ height: "56px" }} // Match TextField height
                  >
                    Tìm kiếm
                  </Button>
                </Stack>
              </form>
            </AccordionDetails>
          </Accordion>

          {/* Conditional Accordion for Tình trạng when showEdit is true */}
          {showEdit && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Tình trạng</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormControl fullWidth>
                  <InputLabel>Tình trạng</InputLabel>
                  <Select
                    value={localIsPublished}
                    onChange={handleIsPublishedChange}
                    label="Tình trạng"
                  >
                    <MenuItem value="">
                      <em>Tất cả</em>
                    </MenuItem>
                    <MenuItem value="true">Đã Xuất Bản</MenuItem>
                    <MenuItem value="false">Chưa Xuất Bản</MenuItem>
                  </Select>
                </FormControl>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          {isLoadingCourses ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : errorCourses ? (
            <Typography color="error" align="center">
              {errorCourses}
            </Typography>
          ) : (
            <>
              <Grid container spacing={1}>
                {showEdit && (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        border: "1px dashed grey",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" color="textSecondary">
                          Thêm khóa học mới
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 1 }}
                        >
                          Nhấn vào nút bên dưới để bắt đầu tạo khóa học mới.
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddCourse}
                        >
                          Thêm Khóa Học
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                )}
                {courses.map((course) =>
                  course ? (
                    <Grid item key={course.id} xs={12} sm={6} md={4}>
                      <CourseCard course={course} showEdit={showEdit} />
                    </Grid>
                  ) : null
                )}
              </Grid>

              {/* Pagination */}
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CoursesList;
