import { useMediaQuery, Box, Drawer } from "@mui/material";
import { Sidebar } from "react-mui-sidebar";
import SidebarItems from "./SidebarItems";
import Logo from "@/components/logo/Logo";
import { Theme, useTheme } from "@mui/material/styles";
interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: ItemType) => {
  const theme = useTheme();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const sidebarWidth = "270px";
  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#eff2f7",
      borderRadius: "15px",
    },
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: (theme) => ({
              boxShadow: theme.shadows[8],
              ...scrollbarStyles,
            }),
          }}
        >
          <Box
            sx={{
              height: "100%",
            }}
          >
            <Sidebar
              width={"270px"}
              collapsewidth="80px"
              open={isSidebarOpen}
              themeColor="#5d87ff"
              themeSecondaryColor="#49beff"
              showProfile={false}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Logo />
              </Box>
              <Box>
                <SidebarItems />
              </Box>
            </Sidebar>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <Box px={2}>
        <Sidebar
          width={"270px"}
          collapsewidth="80px"
          isCollapse={false}
          mode="light"
          direction="ltr"
          themeColor="#5d87ff"
          themeSecondaryColor="#49beff"
          showProfile={false}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo />
          </Box>
          <SidebarItems />
        </Sidebar>
      </Box>
    </Drawer>
  );
};

export default MSidebar;
