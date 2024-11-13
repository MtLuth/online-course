'use client';
import React from "react";
import { Grid, Paper } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import InstructorInfoTable from "@/sections/admin/InstructorView";
import BaseCard from "@/components/shared/BaseCard";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: "60px",
}));

const lightTheme = createTheme({ palette: { mode: "light" } });

const Tables = () => {
    return (
        <ThemeProvider theme={lightTheme}>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={12}>

                    <InstructorInfoTable />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Tables;