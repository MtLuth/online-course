"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Card,
} from "@mui/material";
import Sidebar from "@/components/sidebar-profile/Sidebar-Profile";
import { useProfileContext } from "@/context/ProfileContext";
import { useAppContext } from "@/context/AppContext";
import { useToastNotification } from "@/hook/useToastNotification";

const UpdatePhoto = () => {
  const { profileData, setProfileData } = useProfileContext();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(profileData.avt);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);
  const { notifyError, notifySuccess } = useToastNotification();
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const { sessionToken } = useAppContext();

  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/user/profile/${uid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        if (data.message.avt) {
          localStorage.setItem("avatar", data.message.avt);
        }

        setProfileData({
          email: data.message.email || "",
          fullName: data.message.fullName || "",
          phoneNumber: data.message.phoneNumber || "+84",
          avt: data.message.avt || localStorage.getItem("avatar"),
        });
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching profile data."
        );
      } finally {
        setIsLoading(false);
      }
    };
    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) {
      setPreview(savedAvatar); // Update the preview from localStorage
    }
    fetchProfile();
  }, []);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      notifyError("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPEG, JPG).");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setPreview(URL.createObjectURL(file));
    setImage(file);
    setIsSaveEnabled(true);
  };

  const handleSave = async () => {
    if (!image || !sessionToken) {
      notifyError("Không có ảnh để lưu hoặc bạn chưa đăng nhập.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setIsLoading(true);

    try {
      const uploadResponse = await fetch(
        `http://localhost:8080/api/v1/upload/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Tải lên ảnh thất bại.");
      }

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.message) {
        throw new Error("Không nhận được URL từ server.");
      }

      const uploadedUrl = uploadResult.message;

      const saveResponse = await fetch(
        `http://localhost:8080/api/v1/user/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            photoURL: uploadedUrl,
          }),
        }
      );

      if (!saveResponse.ok) {
        throw new Error("Cập nhật thông tin thất bại.");
      }

      const saveResult = await saveResponse.json();

      // Hiển thị thông báo thành công
      notifySuccess(
        "Cập nhật thông tin thành công! Vui lòng đăng nhập lại để thấy ảnh avatar mới"
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Cập nhật avatar
      setProfileData((prevData) => ({
        ...prevData,
        avt: uploadedUrl,
      }));

      // Store the updated avatar URL in localStorage
      localStorage.setItem("avatar", uploadedUrl);

      setPreview(uploadedUrl);
      setIsSaveEnabled(false);
    } catch (error: any) {
      setSnackbarMessage(error.message || "Có lỗi xảy ra khi lưu thông tin.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex" }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <Box sx={{ flex: 1, padding: 3 }}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              {/* Tiêu đề */}
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                Cập nhật ảnh đại diện
              </Typography>
            </Box>

            {isLoading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <CircularProgress />
              </Box>
            )}

            {/* Avatar */}
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Avatar
                src={
                  preview ||
                  localStorage.getItem("avatar") ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile Preview"
                sx={{
                  width: 150,
                  height: 150,
                  margin: "auto",
                  mb: 2,
                  border: "2px solid #ccc",
                }}
              />
            </Box>

            {/* Nút Tải lên */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                  width: "120px",
                  height: "40px",
                  mb: 2,
                }}
                disabled={isLoading}
              >
                Tải ảnh lên
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleUpload}
                />
              </Button>
            </Box>

            {/* Nút Save */}
            <Box sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                  width: "120px",
                  height: "40px",
                }}
                onClick={handleSave}
                disabled={!isSaveEnabled || isLoading}
              >
                Lưu
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdatePhoto;
