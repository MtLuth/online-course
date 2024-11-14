// components/courseplayer/CoursePlayer.tsx
"use client";

import React from "react";
import { Box, Grid, Typography, Divider, Paper } from "@mui/material";
import { CourseDetail as CourseDetailType } from "@/model/CourseDetail.model";
import VideoPlayer from "@/components/VideoPlayer";
import LectureNavigation from "@/components/LectureNavigation";
import LectureList from "@/components/courseplayer/LectureList";
import ResourcesList from "@/components/courseplayer/ResourcesList"; // Import component ResourcesList

interface CoursePlayerProps {
  course: CourseDetailType;
  currentLectureIndex: { section: number; lecture: number };
  setCurrentLectureIndex: React.Dispatch<
    React.SetStateAction<{ section: number; lecture: number }>
  >;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  currentLectureIndex,
  setCurrentLectureIndex,
}) => {
  const { section, lecture } = currentLectureIndex;
  const currentLecture = course.content[section]?.lectures[lecture];

  // Determine if there is a previous or next lecture
  const hasPrev = section > 0 || lecture > 0;
  const hasNext =
    section < course.content.length - 1 ||
    lecture < course.content[section].lectures.length - 1;

  const handleNavigate = (direction: "prev" | "next") => {
    let newSection = section;
    let newLecture = lecture;

    if (direction === "prev") {
      if (lecture > 0) {
        newLecture--;
      } else if (section > 0) {
        newSection--;
        newLecture = course.content[newSection].lectures.length - 1;
      }
    } else if (direction === "next") {
      if (lecture < course.content[section].lectures.length - 1) {
        newLecture++;
      } else if (section < course.content.length - 1) {
        newSection++;
        newLecture = 0;
      }
    }

    setCurrentLectureIndex({ section: newSection, lecture: newLecture });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {/* Lecture List */}
        <Grid item xs={12} md={3}>
          <LectureList
            content={course.content}
            currentLectureIndex={currentLectureIndex}
            setCurrentLectureIndex={setCurrentLectureIndex}
          />
        </Grid>

        {/* Video Player / Article Description and Lecture Details */}
        <Grid item xs={12} md={9}>
          <Typography variant="h5" gutterBottom>
            {currentLecture?.title}
          </Typography>

          {/* Conditional Rendering based on Lecture Type */}
          {currentLecture?.type === "video" && currentLecture.videoUrl ? (
            <VideoPlayer
              videoUrl={currentLecture.videoUrl}
              title={currentLecture.title}
            />
          ) : currentLecture?.type === "article" ? (
            <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
              <Typography variant="body1">
                {currentLecture.description ||
                  "Không có mô tả cho bài giảng này."}
              </Typography>
            </Paper>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Không có nội dung cho bài giảng này.
            </Typography>
          )}

          {/* Lecture Resources */}
          {currentLecture?.resources && currentLecture.resources.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Tài nguyên:</Typography>
              <ResourcesList resources={currentLecture.resources} />
            </Box>
          )}

          {/* Lecture Navigation */}
          <LectureNavigation
            hasPrev={hasPrev}
            hasNext={hasNext}
            onNavigate={handleNavigate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoursePlayer;
