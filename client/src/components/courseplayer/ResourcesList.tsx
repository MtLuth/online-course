// components/courseplayer/ResourcesList.tsx
"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Paper,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

interface Resource {
  title: string;
  fileUrl: string;
}

interface ResourcesListProps {
  resources: Resource[];
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
  return (
    <Paper sx={{ p: 2 }} elevation={2}>
      <List>
        {resources.map((resource, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <DownloadIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={resource.title}
              secondary={
                <Link
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tải xuống
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ResourcesList;
