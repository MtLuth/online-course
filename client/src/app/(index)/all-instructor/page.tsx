"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActionArea,
} from "@mui/material";
import { instructorApi } from "@/server/Instructor";
import { useToastNotification } from "@/hook/useToastNotification";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParam, setSearchParam] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const { notifyError } = useToastNotification();

  const { sessionToken } = useAppContext();
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await instructorApi.instructorAll(
        page,
        itemsPerPage,
        searchParam,
        "active"
      );
      if (response.status === "Successfully") {
        setInstructors(response.message?.results || []);
        setTotalPages(response.message?.pageCount || 1);
      } else {
        notifyError("Không thể tải dữ liệu chuyên gia.");
      }
    } catch (error) {
      console.error("Error fetching instructors:", error);
      notifyError("Đã xảy ra lỗi khi tải dữ liệu chuyên gia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [page, searchParam, itemsPerPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setItemsPerPage(event.target.value as number);
    setPage(1);
  };

  const handleGoToChat = (instructorId: string) => {
    window.location.href = `/chat/${instructorId}`;
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 4,
          padding: 2,
          backgroundColor: "#f3f4f6",
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        Tất Cả Các Chuyên Gia
      </Typography>

      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{ mb: 4, display: "flex", justifyContent: "center" }}
      >
        <TextField
          label="Tìm kiếm chuyên gia"
          variant="outlined"
          fullWidth
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchSubmit(e);
          }}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            width: "50%",
            maxWidth: 600,
            backgroundColor: "#fff",
            marginRight: 2,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            padding: "14px 24px",
            borderRadius: 2,
            boxShadow: 3,
            fontSize: "1rem",
            height: "100%",
            width: "150px",
            alignSelf: "center",
            marginTop: 1,
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ marginTop: 3 }}
          >
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
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
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>

          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            {instructors.length > 0 ? (
              instructors.map((instructor) => (
                <Grid item xs={12} sm={6} md={4} key={instructor.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 3,
                      height: "100%",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <CardActionArea>
                      <CardContent sx={{ padding: 3 }}>
                        <Avatar
                          src={instructor.avt}
                          alt={instructor.fullName}
                          sx={{
                            width: 80,
                            height: 80,
                            marginBottom: 2,
                            marginX: "auto",
                            border: "3px solid #3f51b5",
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "#333",
                          }}
                        >
                          {instructor.fullName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            textAlign: "center",
                            marginTop: 1,
                            fontSize: "0.875rem",
                          }}
                        >
                          {instructor.expertise}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            textAlign: "center",
                            fontSize: "0.875rem",
                          }}
                        >
                          {instructor.education}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            marginTop: 2,
                            fontSize: "0.875rem",
                            color: "#777",
                          }}
                        >
                          {instructor.bio}
                        </Typography>
                        <Button
                          component={Link}
                          href={`/instructor/${instructor.id}`}
                          variant="outlined"
                          color="primary"
                          sx={{
                            marginTop: 2,
                            fontWeight: "bold",
                            width: "100%",
                          }}
                        >
                          Trang Cá Nhân
                        </Button>
                        {sessionToken && (
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              marginTop: 2,
                              width: "100%",
                              fontWeight: "bold",
                            }}
                            onClick={() => handleGoToChat(instructor.id)}
                          >
                            Nhắn Tin
                          </Button>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  textAlign="center"
                >
                  Không tìm thấy chuyên gia nào.
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default InstructorsPage;
