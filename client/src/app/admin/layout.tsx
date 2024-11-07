"use client";

import * as React from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
