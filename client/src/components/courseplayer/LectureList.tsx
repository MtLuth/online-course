// components/courseplayer/LectureList.tsx
"use client";

import React from "react";
import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface LectureListProps {
  content: any;
  currentLectureIndex: { section: number; lecture: number };
  setCurrentLectureIndex: React.Dispatch<
    React.SetStateAction<{ section: number; lecture: number }>
  >;
}

const LectureList: React.FC<LectureListProps> = ({
  content,
  currentLectureIndex,
  setCurrentLectureIndex,
}) => {
  const [openSections, setOpenSections] = React.useState<boolean[]>(
    content.map(() => true) // All sections expanded by default
  );

  const handleSectionClick = (index: number) => {
    setOpenSections((prev) => {
      const newState = [...prev];
      newState[index] = !prev[index];
      return newState;
    });
  };

  return (
    <List component="nav">
      {content.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <ListItemButton onClick={() => handleSectionClick(sectionIndex)}>
            <ListItemText
              primary={`Phần ${sectionIndex + 1}: ${section.sectionTitle}`}
            />
            {openSections[sectionIndex] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse
            in={openSections[sectionIndex]}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {section.lectures.map((lecture, lectureIndex) => {
                const isActive =
                  currentLectureIndex.section === sectionIndex &&
                  currentLectureIndex.lecture === lectureIndex;
                return (
                  <ListItemButton
                    key={lectureIndex}
                    selected={isActive}
                    sx={{ pl: 4 }}
                    onClick={() =>
                      setCurrentLectureIndex({
                        section: sectionIndex,
                        lecture: lectureIndex,
                      })
                    }
                  >
                    <ListItemText
                      primary={`Bài ${lectureIndex + 1}: ${lecture.title}`}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </div>
      ))}
    </List>
  );
};

export default LectureList;
