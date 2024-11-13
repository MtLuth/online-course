import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import CourseCard from "./CourseCard";
import { Course } from "@/model/Course.model";

interface CoursesListProps {
  courses: Course[] | undefined;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return (
      <Box sx={{ flexGrow: 1, padding: 16 }}>
        <Typography variant="h6" color="textSecondary" align="center">
          Không có khóa học nào để hiển thị.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh Sách Các Khóa Học
      </Typography>

      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoursesList;
