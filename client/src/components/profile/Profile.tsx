"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Divider, // Import Divider for separation
} from "@mui/material";
import {
  School as IconCourses,
  Dashboard as IconDashboard,
  Person as IconProfile,
  MenuBook as IconLearning,
  History as IconHistory,
  ShoppingCart as IconShoppingCart,
  Chat as IconChat,
  Logout as IconLogout,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { authApi } from "@/server/Auth";
import { userApi } from "@/server/User";
import { useAppContext } from "@/context/AppContext";
import { useToastNotification } from "@/hook/useToastNotification";
import Cookies from "js-cookie";

interface UserProfile {
  email: string;
  fullName: string;
  phoneNumber: string | null;
  avt: string;
}

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { setSessionToken } = useAppContext();
  const { notifySuccess, notifyError } = useToastNotification();
  const { userRole } = useAppContext();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = async () => {
    try {
      await authApi.logout();
      setSessionToken(null);
      Cookies.remove("role");
      notifySuccess("Đã đăng xuất thành công!");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      notifyError("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const uid = localStorage.getItem("uid");
      const token = localStorage.getItem("accessToken");
      if (!uid || !token) {
        notifyError(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
        router.push("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await userApi.profileUser(uid, token);
        if (response.status === "Successfully") {
          setUserProfile(response.message);
        } else {
          notifyError("Không thể lấy thông tin hồ sơ.");
        }
      } catch (error: any) {
        console.error("Error fetching user profile:", error);
        notifyError(error.message || "Đã xảy ra lỗi khi lấy thông tin hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show profile options"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(anchorEl2 && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        {loading ? (
          <CircularProgress size={35} />
        ) : (
          <Avatar
            src={userProfile?.avt || ""}
            alt={userProfile?.fullName || "User"}
            sx={{
              width: 35,
              height: 35,
            }}
          >
            {userProfile?.fullName ? userProfile.fullName.charAt(0) : "U"}
          </Avatar>
        )}
      </IconButton>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "250px", // Increased width for better layout
            paddingTop: 1, // Add top padding
          },
        }}
      >
        {/* Profile Header */}
        <Box
          px={2}
          py={1}
          display="flex"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Avatar
            src={userProfile?.avt || ""}
            alt={userProfile?.fullName || "User"}
            sx={{
              width: 60,
              height: 60,
              marginBottom: 1,
            }}
          >
            {userProfile?.fullName ? userProfile.fullName.charAt(0) : "U"}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold">
            {userProfile?.fullName || "Người dùng"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userProfile?.email}
          </Typography>
          {userProfile?.phoneNumber && (
            <Typography variant="body2" color="textSecondary">
              {userProfile.phoneNumber}
            </Typography>
          )}
        </Box>
        <Divider /> {/* Divider separates header from menu items */}
        {/* Menu Items */}
        {userRole === "teacher" && (
          <>
            <Link href="/dashboard/" passHref legacyBehavior>
              <MenuItem component="a" onClick={handleClose2}>
                <ListItemIcon>
                  <IconDashboard fontSize="small" />
                </ListItemIcon>
                <ListItemText>Bảng điều khiển</ListItemText>
              </MenuItem>
            </Link>
            <Link href="/my-courses" passHref legacyBehavior>
              <MenuItem component="a" onClick={handleClose2}>
                <ListItemIcon>
                  <IconCourses fontSize="small" />
                </ListItemIcon>
                <ListItemText>Khóa học của tôi</ListItemText>
              </MenuItem>
            </Link>
          </>
        )}
        {userRole === "admin" && (
          <Link href="/dashboard/" passHref legacyBehavior>
            <MenuItem component="a" onClick={handleClose2}>
              <ListItemIcon>
                <IconDashboard fontSize="small" />
              </ListItemIcon>
              <ListItemText>Bảng điều khiển</ListItemText>
            </MenuItem>
          </Link>
        )}
        <Link href="/profile" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconProfile fontSize="small" />
            </ListItemIcon>
            <ListItemText>Hồ sơ cá nhân</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/mylearning" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconLearning fontSize="small" />
            </ListItemIcon>
            <ListItemText>Học tập</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/history" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconHistory fontSize="small" />
            </ListItemIcon>
            <ListItemText>Lịch sử mua hàng</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/chat" passHref legacyBehavior>
          <MenuItem component="a" onClick={handleClose2}>
            <ListItemIcon>
              <IconChat fontSize="small" />
            </ListItemIcon>
            <ListItemText>Trò Chuyện</ListItemText>
          </MenuItem>
        </Link>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<IconLogout fontSize="small" />}
          >
            Đăng xuất
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
