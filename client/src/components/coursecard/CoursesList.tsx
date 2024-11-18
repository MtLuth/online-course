// components/coursecard/CoursesList.tsx

"use client";

import React, { useState, useEffect } from "react";
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
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CourseCard from "./CourseCard";
import { CourseDetail } from "@/interfaces/CourseDetail";
import { useRouter } from "next/navigation";
import { categoriesApi } from "@/server/Categories";
import { getAuthToken } from "@/utils/auth";

interface CoursesListProps {
  courses: CourseDetail[] | undefined;
  page: number;
  pageCount: number;
  itemCount: number;
  limit: number;
  searchParam?: string;
  category?: string;
  isPublished?: boolean;
  orderByPrice?: string;
  showEdit?: boolean;
}

const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  page,
  pageCount,
  itemCount,
  limit,
  searchParam = "",
  category = "",
  isPublished,
  orderByPrice = "asc",
  showEdit = false,
}) => {
  const router = useRouter();
  const token = getAuthToken();
  const [localSearchParam, setLocalSearchParam] = useState<string>(searchParam);
  const [localCategory, setLocalCategory] = useState<string>(category);
  const [localIsPublished, setLocalIsPublished] = useState<string>(
    isPublished !== undefined ? isPublished.toString() : ""
  );
  const [localOrderByPrice, setLocalOrderByPrice] =
    useState<string>(orderByPrice);
  const [localLimit, setLocalLimit] = useState<number>(limit);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] =
    useState<boolean>(false);
  const [errorCategories, setErrorCategories] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await categoriesApi.getCategories(token || "");
        if (response && response.message) {
          setCategories(response.message.results);
        } else {
          setErrorCategories("Không thể tải danh mục.");
        }
      } catch (error) {
        setErrorCategories("Có lỗi xảy ra khi tải danh mục.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [showEdit, token]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const params: { [key: string]: string | number | undefined } = {
      page: 1,
      limit: localLimit,
    };

    if (localSearchParam.trim() !== "") {
      params.searchParam = localSearchParam.trim();
    }

    if (localCategory !== "") {
      params.category = localCategory;
    }

    if (localIsPublished !== "") {
      params.isPublished = localIsPublished;
    }

    if (localOrderByPrice !== "asc") {
      params.orderByPrice = localOrderByPrice;
    }

    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as { [key: string]: string })
    ).toString();

    router.push(`/all-courses?${query}`);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const params = new URLSearchParams();

    params.append("page", value.toString());
    params.append("limit", localLimit.toString());

    if (localSearchParam.trim() !== "") {
      params.append("searchParam", localSearchParam.trim());
    }

    if (localCategory !== "") {
      params.append("category", localCategory);
    }

    if (localIsPublished !== "") {
      params.append("isPublished", localIsPublished);
    }

    if (localOrderByPrice !== "asc") {
      params.append("orderByPrice", localOrderByPrice);
    }

    const query = params.toString();

    router.push(`/all-courses?${query}`);
  };

  const handleAddCourse = () => {
    router.push("/dashboard/teacher/create-course/");
  };

  const handleLimitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLimit = event.target.value as number;
    setLocalLimit(newLimit);

    const params: { [key: string]: string | number | undefined } = {
      page: 1,
      limit: newLimit,
    };

    if (localSearchParam.trim() !== "") {
      params.searchParam = localSearchParam.trim();
    }

    if (localCategory !== "") {
      params.category = localCategory;
    }

    if (localIsPublished !== "") {
      params.isPublished = localIsPublished;
    }

    if (localOrderByPrice !== "asc") {
      params.orderByPrice = localOrderByPrice;
    }

    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as { [key: string]: string })
    ).toString();

    router.push(`/all-courses?${query}`);
  };

  const handleOrderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newOrder = event.target.value as string;
    setLocalOrderByPrice(newOrder);

    const params: { [key: string]: string | number | undefined } = {
      page: 1,
      limit: localLimit,
    };

    if (localSearchParam.trim() !== "") {
      params.searchParam = localSearchParam.trim();
    }

    if (localCategory !== "") {
      params.category = localCategory;
    }

    if (newOrder !== "asc") {
      params.orderByPrice = newOrder;
    }

    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as { [key: string]: string })
    ).toString();

    router.push(`/all-courses?${query}`);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newCategory = event.target.value as string;
    setLocalCategory(newCategory);

    const params: { [key: string]: string | number | undefined } = {
      page: 1,
      limit: localLimit,
    };

    if (localSearchParam.trim() !== "") {
      params.searchParam = localSearchParam.trim();
    }

    if (newCategory !== "") {
      params.category = newCategory;
    }

    if (localIsPublished !== "") {
      params.isPublished = localIsPublished;
    }

    if (localOrderByPrice !== "asc") {
      params.orderByPrice = localOrderByPrice;
    }

    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== "") {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as { [key: string]: string })
    ).toString();

    router.push(`/all-courses?${query}`);
  };

  if (!courses || courses.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, padding: 4 }}>
        <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Không có khóa học nào để hiển thị.
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
        sx={{ fontWeight: "bold" }}
      >
        {showEdit ? "Các Khóa Học Của Tôi" : "Tất cả các Khóa Học"}
      </Typography>
      <Box sx={{ display: "flex", flexGrow: 1, padding: 4 }}>
        <Box sx={{ minWidth: 270, pr: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tìm kiếm khóa học
          </Typography>

          {/* Thêm Accordion cho chọn limit */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Hiển thị số lượng</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <InputLabel>Chọn số lượng</InputLabel>
                <Select
                  value={localLimit}
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

          {/* Các phần filter và tìm kiếm */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Danh mục</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Tìm kiếm tên khóa học</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Nhập tên ..."
                value={localSearchParam}
                onChange={(e) => setLocalSearchParam(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit(e);
                  }
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
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
            {courses &&
              courses.length > 0 &&
              courses.map((course) =>
                course ? (
                  <Grid item key={course.id} xs={12} sm={6} md={4}>
                    <CourseCard course={course} showEdit={showEdit} />
                  </Grid>
                ) : null
              )}
          </Grid>

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
            />
          </Stack>
        </Box>
      </Box>{" "}
    </Box>
  );
};

export default CoursesList;
