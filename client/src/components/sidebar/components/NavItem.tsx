import React from "react";
import {
  ListItemIcon,
  ListItem,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Link from "next/link";
import { styled, useTheme } from "@mui/material/styles";

type NavGroup = {
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: React.ElementType;
  href?: string;
  disabled?: boolean;
  external?: boolean;
};

interface ItemType {
  item: NavGroup;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  level?: number;
  pathDirect: string;
}

const NavItem = ({ item, level = 1, pathDirect, onClick }: ItemType) => {
  const theme = useTheme();
  const Icon = item.icon;
  const itemIcon = Icon ? <Icon stroke={1.5} size="1.3rem" /> : null;

  const ListItemStyled = styled(ListItem)(({ theme }) => ({
    padding: 0,
    ".MuiButtonBase-root": {
      whiteSpace: "nowrap",
      marginBottom: "2px",
      padding: "8px 10px",
      borderRadius: "8px",
      backgroundColor: level > 1 ? "transparent !important" : "inherit",
      color: theme.palette.text.secondary,
      paddingLeft: "10px",
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.main,
      },
      "&.Mui-selected": {
        color: "white",
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.main,
          color: "white",
        },
      },
    },
  }));

  return (
    <List component="div" disablePadding key={item.id}>
      <ListItemStyled>
        <ListItemButton
          component={Link}
          href={item.href || "#"}
          disabled={item.disabled}
          selected={pathDirect === item.href}
          target={item.external ? "_blank" : "_self"}
          onClick={onClick}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: "36px",
                padding: "3px 0",
                color: "inherit",
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          <ListItemText primary={item.title} />
        </ListItemButton>
      </ListItemStyled>
    </List>
  );
};

export default NavItem;
