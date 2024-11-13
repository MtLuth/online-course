// NavItem.tsx

import { forwardRef } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import ListItemButton from "@mui/material/ListItemButton";

import Iconify from "../../iconify";
import { NavItemProps } from "../types";
import RouterLink from "@/routes/components/RouterLink";

const StyledNavItem = forwardRef<HTMLDivElement, any>(
  ({ open, depth, active, disabled, ...other }, ref) => {
    const subItem = depth !== 1;
    const deepSubItem = Number(depth) > 2;
    const opened = open && !active;

    const styles: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      width: "100%",
      maxWidth: "100%",
      padding: subItem ? "4px 12px" : "4px 24px",
      borderRadius: 8,
      marginBottom: 4,
      color: subItem ? "#6e6e6e" : "#9e9e9e",
      cursor: disabled ? "default" : "pointer",
      textDecoration: "none",
      backgroundColor: active ? "#F0F4FF" : opened ? "#f5f5f5" : "transparent",
      transition: "background-color 0.3s",
    };

    if (deepSubItem) {
      styles.paddingLeft = `${16 * depth}px`;
    }

    return (
      <ListItemButton ref={ref} disabled={disabled} style={styles} {...other} />
    );
  }
);

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  (
    {
      title,
      path,
      icon,
      info,
      disabled,
      caption,
      roles,
      open,
      depth,
      active,
      hasChild,
      externalLink,
      currentRole = "admin",
      ...other
    },
    ref
  ) => {
    const subItem = depth !== 1;

    const renderContent = (
      <StyledNavItem
        ref={ref}
        open={open}
        depth={depth}
        active={active}
        disabled={disabled}
        {...other}
      >
        {!subItem && icon && (
          <Box component="span" style={iconStyles}>
            {icon}
          </Box>
        )}

        {subItem && icon ? (
          <Box component="span" style={iconStyles}>
            {icon}
          </Box>
        ) : (
          <Box component="span" style={subIconStyles} />
        )}

        {title && (
          <Box
            component="span"
            style={{
              flex: "1 1 auto",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box component="span" style={labelStyles}>
              {title}
            </Box>

            {caption && (
              <Tooltip title={caption} placement="top-start">
                <Box component="span" style={captionStyles}>
                  {caption}
                </Box>
              </Tooltip>
            )}
          </Box>
        )}

        {info && (
          <Box component="span" style={infoStyles}>
            {info}
          </Box>
        )}

        {hasChild && (
          <Iconify
            width={16}
            style={arrowStyles}
            icon={
              open
                ? "eva:arrow-ios-downward-fill"
                : "eva:arrow-ios-forward-fill"
            }
          />
        )}
      </StyledNavItem>
    );

    if (roles && !roles.includes(`${currentRole}`)) {
      return null;
    }

    if (externalLink) {
      return (
        <Link
          href={path}
          target="_blank"
          rel="noopener"
          color="inherit"
          underline="none"
          style={
            disabled
              ? { cursor: "default", textDecoration: "none" }
              : { textDecoration: "none" }
          }
        >
          {renderContent}
        </Link>
      );
    }

    return (
      <Link
        component={RouterLink}
        href={path}
        color="inherit"
        underline="none"
        style={
          disabled
            ? { cursor: "default", textDecoration: "none" }
            : { textDecoration: "none" }
        }
      >
        {renderContent}
      </Link>
    );
  }
);

const iconStyles: React.CSSProperties = {
  width: 24,
  height: 24,
  flexShrink: 0,
  marginRight: 16,
};

const subIconStyles: React.CSSProperties = {
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const labelStyles: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  textTransform: "capitalize",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const captionStyles: React.CSSProperties = {
  fontSize: "12px",
  color: "#9e9e9e",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const infoStyles: React.CSSProperties = {
  display: "inline-flex",
  marginLeft: 6,
};

const arrowStyles: React.CSSProperties = {
  flexShrink: 0,
  marginLeft: 6,
};

export default NavItem;
