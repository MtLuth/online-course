// components/LectureNavigation.tsx
"use client";

import React from "react";
import { Box, Button, Stack } from "@mui/material";

interface LectureNavigationProps {
  hasPrev: boolean;
  hasNext: boolean;
  onNavigate: (direction: "prev" | "next") => void;
}

const LectureNavigation: React.FC<LectureNavigationProps> = ({
  hasPrev,
  hasNext,
  onNavigate,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          disabled={!hasPrev}
          onClick={() => onNavigate("prev")}
          sx={{
            textTransform: "none",
            backgroundColor: hasPrev ? "primary.main" : "grey.300",
            "&:hover": {
              backgroundColor: hasPrev ? "primary.dark" : "grey.300",
            },
          }}
        >
          Bài trước
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!hasNext}
          onClick={() => onNavigate("next")}
          sx={{
            textTransform: "none",
            backgroundColor: hasNext ? "primary.main" : "grey.300",
            "&:hover": {
              backgroundColor: hasNext ? "primary.dark" : "grey.300",
            },
          }}
        >
          Bài tiếp theo
        </Button>
      </Stack>
    </Box>
  );
};

export default LectureNavigation;
