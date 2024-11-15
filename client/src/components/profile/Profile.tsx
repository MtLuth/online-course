import React, { useState } from "react";
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
} from "@mui/material";
import {
  School as IconCourses,
  Dashboard as IconDashboard,
  Person as IconProfile,
  Assignment as IconTasks,
} from "@mui/icons-material";
const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const router = useRouter();
  const { setSessionToken } = useAppContext();
  const { notifySuccess } = useToastNotification();

  const handleClick2 = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    authApi.logout();
    setSessionToken(null);
    notifySuccess("Đã đăng xuất thành công!");
    router.push("/login");
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show profile options"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src=""
          alt="E"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <Link href="/my-courses" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <IconCourses fontSize="small" />
            </ListItemIcon>
            <ListItemText>Khóa học của tôi</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/dashboard/teacher" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <IconDashboard fontSize="small" />
            </ListItemIcon>
            <ListItemText>Bảng điều khiển</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/profile" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <IconProfile fontSize="small" />
            </ListItemIcon>
            <ListItemText>Hồ sơ cá nhân</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/history" passHref>
          <MenuItem component="a">
            <ListItemIcon>
              <IconTasks fontSize="small" />
            </ListItemIcon>
            <ListItemText>Lịch sử mua hàng</ListItemText>
          </MenuItem>
        </Link>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
