import Box, { BoxProps } from "@mui/material/Box";
import Container from "@mui/material/Container";

import Header from "./Header";
import Footer from "./Footer";
import { HEADER } from "../config-layout";

type Props = BoxProps & {
  children: React.ReactNode;
  headerOnDark?: boolean;
  disabledSpacing?: boolean;
};

export default function MainLayout({
  children,
  headerOnDark = false,
  disabledSpacing = false,
  sx,
  ...other
}: Props) {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
      {...other}
    >
      <Header headerOnDark={headerOnDark} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        {!(disabledSpacing || headerOnDark) && (
          <Box
            sx={{
              height: { xs: HEADER.H_MOBILE, md: HEADER.H_DESKTOP },
            }}
          />
        )}

        <Container
          sx={{
            flexGrow: 1,
            width: "100%",
            maxWidth: "lg",
          }}
        >
          {children}
        </Container>
      </Box>

      {/* Footer Section */}
      <Footer />
    </Box>
  );
}
