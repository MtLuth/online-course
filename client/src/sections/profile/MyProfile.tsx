"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "@/components/sidebar-profile/Sidebar-Profile";
import { useProfileContext } from "@/context/ProfileContext";
import { useAppContext } from "@/context/AppContext";
import { useToastNotification } from "@/hook/useToastNotification";

const ProfilePage = () => {
  const { profileData, setProfileData } = useProfileContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const { notifySuccess, notifyError } = useToastNotification();
  const { sessionToken } = useAppContext();
  const uid = localStorage.getItem("uid");

  // Trạng thái theo dõi sự thay đổi trong các trường
  const [isChanged, setIsChanged] = useState<boolean>(false);

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

    fetchProfile();
  }, []);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      // If the field is phoneNumber, format it with +84
      if (field === "phoneNumber") {
        // Remove any non-numeric characters
        value = value.replace(/[^0-9]/g, "");

        // Add +84 if it doesn't start with it
        if (!value.startsWith("84")) {
          value = "+84" + value;
        } else {
          value = "+84" + value.slice(2); // Ensure it always starts with +84
        }
      }

      setProfileData((prevData) => {
        const updatedData = { ...prevData, [field]: value };

        // Check if any data has changed
        const hasChanges =
          updatedData.fullName !== prevData.fullName ||
          updatedData.phoneNumber !== prevData.phoneNumber ||
          updatedData.avt !== prevData.avt;

        setIsChanged(hasChanges); // Set the change status

        return updatedData;
      });
    };

  const handleSave = async () => {
    if (!profileData.phoneNumber || profileData.phoneNumber.length <= 4) {
      notifyError("Số điện thoại là bắt buộc!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const updatedData = {
        displayName: profileData.fullName,
        phoneNumber: profileData.phoneNumber,
        photoURL: profileData.avt,
      };

      const response = await fetch(
        "http://localhost:8080/api/v1/user/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const result = await response.json();
      notifySuccess("Đã cập nhật thông tin hồ sơ thành công!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Save avatar URL after successful profile update
      localStorage.setItem("avatar", profileData.avt);
    } catch (err: any) {
      setSnackbarMessage(
        err.message || "An error occurred while updating the profile."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box sx={{ flex: 1, padding: 3 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              align="center"
              sx={{ mb: 3 }}
            >
              Thông tin cá nhân
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Thông tin cơ bản:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={profileData.fullName}
                  onChange={handleInputChange("fullName")}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại (*)"
                  value={profileData.phoneNumber}
                  onChange={handleInputChange("phoneNumber")}
                  variant="outlined"
                  type="text" // Ensure the field accepts the `+84` prefix
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3, display: "block", marginLeft: "auto" }}
              onClick={handleSave}
              disabled={!isChanged} // Disable Save button when no change is detected
            >
              Lưu
            </Button>
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

export default ProfilePage;
