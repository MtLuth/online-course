// src/components/sidebar/SidebarItems.tsx

import React from "react";
import { usePathname } from "next/navigation";
import { Box, List, Typography } from "@mui/material";
import NavItem from "./components/NavItem";
import NavGroup from "./components/NavGroup";
import Menuitems from "./Menuitems"; // Đảm bảo đường dẫn đúng
import { useAppContext } from "@/context/AppContext";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const { userRole } = useAppContext();

  if (!Array.isArray(Menuitems)) {
    console.error("Menuitems không phải là một mảng!", Menuitems);
    return (
      <Box sx={{ px: 3 }}>
        <Typography color="error">Không thể tải danh sách menu.</Typography>
      </Box>
    );
  }
  const filteredMenuItems = Menuitems.filter((item) => {
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }
    return true;
  });

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
        {filteredMenuItems.map((item) => {
          if (item.navlabel && item.subheader) {
            const hasVisibleChildren = Menuitems.some(
              (child) =>
                child.subheader === item.subheader &&
                (!child.roles || child.roles.includes(userRole))
            );
            if (!hasVisibleChildren) {
              return null;
            }

            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
