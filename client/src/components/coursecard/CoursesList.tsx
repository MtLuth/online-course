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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Button,
  TextField,
  Card,
  CardActions,
  CircularProgress,
} from "@mui/material";
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
  showEdit?: boolean; // Controls visibility of edit button in CourseCard
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
    if (!showEdit) {
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
    }
  }, [showEdit, token]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const params: { [key: string]: string | number | undefined } = {
      page: 1, // Reset to first page on new search
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
    router.push("/dashboard/teacher/create-course/"); // Corrected URL
  };

  const handleLimitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLimit = event.target.value as number;
    setLocalLimit(newLimit);

    const params: { [key: string]: string | number | undefined } = {
      page: 1, // Reset to first page when limit changes
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
      page: 1, // Reset to first page on order change
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
      page: 1, // Reset to first page on category change
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
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        {showEdit ? "Các Khóa Học Của Tôi" : "Tất cả các Khóa Học"}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          mb: 4,
        }}
      >
        <TextField
          label="Tìm kiếm theo tên khóa học"
          variant="outlined"
          size="small"
          value={localSearchParam}
          onChange={(e) => setLocalSearchParam(e.target.value)}
          sx={{ minWidth: 350 }}
        />

        {!showEdit && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="category-select-label">Danh mục</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={localCategory}
              label="Danh mục"
              onChange={handleCategoryChange}
              disabled={isLoadingCategories}
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
            {isLoadingCategories && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {errorCategories && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errorCategories}
              </Typography>
            )}
          </FormControl>
        )}

        {!showEdit && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="order-price-label">Sắp xếp giá</InputLabel>
            <Select
              labelId="order-price-label"
              id="order-price-select"
              value={localOrderByPrice}
              label="Sắp xếp giá"
              onChange={handleOrderChange}
            >
              <MenuItem value="asc">Tăng dần</MenuItem>
              <MenuItem value="desc">Giảm dần</MenuItem>
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ height: 40 }}
        >
          Tìm Kiếm
        </Button>
      </Box>

      {/* Controls: Limit Selector */}
      <Box
        sx={{
          display: "flex",
          justifyContent: showEdit ? "space-between" : "flex-end",
          alignItems: "center",
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="limit-select-label">Số lượng</InputLabel>
          <Select
            labelId="limit-select-label"
            id="limit-select"
            value={localLimit}
            label="Số lượng"
            onChange={handleLimitChange}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grid of Course Cards */}
      <Grid container spacing={3}>
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

        {courses.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <CourseCard course={course} showEdit={showEdit} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination and Item Count */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Hiển thị {courses.length} trong tổng số {itemCount} khóa học
        </Typography>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default CoursesList;
