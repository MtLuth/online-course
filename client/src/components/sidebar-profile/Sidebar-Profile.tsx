"use client";

import React from "react";
import { Avatar, Box, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useProfileContext } from "@/context/ProfileContext";

const Sidebar = () => {
    const { profileData } = useProfileContext();
    const router = useRouter();

    return (
        <Box
            sx={{
                width: "25%",
                backgroundColor: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                borderRight: "1px solid #ddd",
            }}
        >
            <Avatar
                src={profileData.avt}
                alt="Profile Picture"
                sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6" fontWeight="bold" align="center">
                {profileData.fullName}
            </Typography>
            <Divider sx={{ width: "100%", my: 2 }} />
            <List sx={{ width: "100%" }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => router.push("/profile")}>
                        <ListItemText primary="Hồ sơ" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => router.push("/profile/edit-image")}>
                        <ListItemText primary="Ảnh" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => router.push("/profile/security")}>
                        <ListItemText primary="Bảo mật tài khoản" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;
