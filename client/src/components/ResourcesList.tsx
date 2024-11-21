"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface Resource {
  title: string;
  fileUrl: string;
}

interface ResourcesListProps {
  resources: Resource[];
}

const ResourcesList: React.FC<ResourcesListProps> = ({ resources }) => {
  return (
    <List>
      {resources.map((resource, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <CheckIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={resource.title}
            secondary={
              <Link
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resource.fileUrl}
              </Link>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ResourcesList;
