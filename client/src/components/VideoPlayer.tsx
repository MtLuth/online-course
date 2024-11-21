// components/VideoPlayer.tsx
"use client";

import React from "react";
import ReactPlayer from "react-player";
import { Box, Typography, Paper } from "@mui/material";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title }) => {
  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Box
        sx={{
          position: "relative",
          paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
        }}
      >
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 1 }}>
        {title}
      </Typography>
    </Paper>
  );
};

export default VideoPlayer;
