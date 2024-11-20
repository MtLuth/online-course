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

const ProfilePage = () => {
    const { profileData, setProfileData } = useProfileContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

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
                setProfileData({
                    email: data.message.email || "",
                    fullName: data.message.fullName || "",
                    phoneNumber: data.message.phoneNumber || "",
                    avt: data.message.avt || "https://via.placeholder.com/100",
                });
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching profile data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [uid, sessionToken, setProfileData]);

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                displayName: profileData.fullName,
                phoneNumber: profileData.phoneNumber,
                photoURL: profileData.avt,
            };

            const response = await fetch("http://localhost:8080/api/v1/user/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionToken}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile.");
            }

            const result = await response.json();
            setSnackbarMessage(result.message || "Profile updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err: any) {
            setSnackbarMessage(err.message || "An error occurred while updating the profile.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
            <Card sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex" }}>
                    {/* Sidebar automatically uses ProfileContext */}
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
                                    label="Số điện thoại"
                                    value={profileData.phoneNumber}
                                    onChange={handleInputChange("phoneNumber")}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, display: "block", marginLeft: "auto" }}
                            onClick={handleSave}
                        >
                            Save
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
