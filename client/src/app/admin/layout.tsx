"use client";

import * as React from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    // const [authToken, setAuthToken] = useState("");
    // const router = useRouter();

    // useEffect(() => {
    //     document.title = 'Login'; // Thiết lập tiêu đề trang
    //     getJWTToken();
    // }, []);

    // const getJWTToken = () => {
    //     const token = localStorage.getItem('jwt');
    //     if (token) {
    //         setAuthToken(token);
    //     }
    // };


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Admin Dashboard
                    </Typography>
                </Toolbar>
                <List>
                    <Link href="/admin/student" passHref>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Quản lý học sinh" />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link href="/admin/teacher" passHref>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary="Quản lý giáo viên" />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
