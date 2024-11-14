// components/coursecard/LectureDetail.tsx
"use client";

import React from "react";
import {
  Box,
  Typography,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ReactPlayer from "react-player";

interface LectureDetailProps {
  lecture: any; // Define proper types based on your data
  course: any;
}

const LectureDetail: React.FC<LectureDetailProps> = ({ lecture, course }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Back Button */}
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Quay lại
      </Button>

      {/* Lecture Title */}
      <Typography variant="h4" gutterBottom>
        {lecture.title}
      </Typography>

      {/* Video Player */}
      <Box
        sx={{
          position: "relative",
          paddingTop: "56.25%" /* 16:9 Aspect Ratio */,
        }}
      >
        <ReactPlayer
          url={lecture.videoUrl}
          controls
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </Box>

      {/* Lecture Details */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Mô tả bài giảng</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {lecture.description || "Không có mô tả cho bài giảng này."}
        </Typography>
      </Box>

      {/* Resources */}
      {lecture.resources && lecture.resources.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Tài nguyên</Typography>
          <List>
            {lecture.resources.map((resource: any, index: number) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={resource.title}
                  secondary={
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource.fileUrl}
                    </a>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Additional Information (Optional) */}
      <Box sx={{ mt: 4 }}>
        <Chip
          label={`Danh mục: ${course.category}`}
          variant="outlined"
          sx={{ mr: 1 }}
        />
        <Chip
          label={`Cấp độ: ${course.level}`}
          variant="outlined"
          sx={{ mr: 1 }}
        />
        <Chip label={`Ngôn ngữ: ${course.language}`} variant="outlined" />
      </Box>
    </Box>
  );
};

export default LectureDetail;
