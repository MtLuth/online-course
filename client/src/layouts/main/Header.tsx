import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import { bgBlur } from "src/theme/css";
import { HEADER } from "../config-layout";
import { navConfig } from "@/layouts/main/data";
import Label from "@/components/label";
import HeaderShadow from "@/layouts/common/HeaderShadow";
import Searchbar from "@/layouts/common/Searchbar";
import Logo from "@/components/logo/Logo";
import { useResponsive } from "@/hook/useResponsive";
import { useOffSetTop } from "@/hook/useOffSetTop";
import { paths } from "@/routes/path";
import NavDesktop from "@/layouts/main/nav/desktop/NavDesktop";
import NavMobile from "@/layouts/main/nav/mobile/NavMobile";
import { useAppContext } from "@/context/AppContext";
import { Avatar } from "@mui/material";
import Profile from "@/components/profile/Profile";

type Props = {
  headerOnDark: boolean;
};

export default function Header({ headerOnDark }: Props) {
  const theme = useTheme();
  const { sessionToken } = useAppContext();
  const offset = useOffSetTop();

  const mdUp = useResponsive("up", "md");

  const renderContent = (
    <>
      <Box sx={{ lineHeight: 0, position: "relative" }}>
        <Logo />

        <Link
          href="https://zone-docs.vercel.app/changelog"
          target="_blank"
          rel="noopener"
        ></Link>
      </Box>

      <>
        <Stack
          flexGrow={1}
          alignItems="center"
          sx={{
            height: 1,
            display: { xs: "none", md: "flex" },
          }}
        >
          <NavDesktop data={navConfig} />
        </Stack>

        <Box sx={{ flexGrow: { xs: 1, md: "unset" } }} />
      </>

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Stack spacing={1} direction="row" alignItems="center">
          <Searchbar />
        </Stack>
        {!sessionToken && (
          <>
            <Button
              variant="contained"
              color="inherit"
              href={paths.register}
              rel="noopener"
              sx={{
                display: { xs: "none", md: "inline-flex" },
              }}
            >
              Đăng Ký
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              href={paths.login}
              rel="noopener"
              sx={{
                display: { xs: "none", md: "inline-flex" },
              }}
            >
              Đăng Nhập
            </Button>
          </>
        )}
        {sessionToken && <Profile />}
      </Stack>

      {!mdUp && <NavMobile data={navConfig} />}
    </>
  );

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(["height", "background-color"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(headerOnDark && {
            color: "common.white",
          }),
          ...(offset && {
            ...bgBlur({ color: theme.palette.background.default }),
            color: "text.primary",
            height: {
              md: HEADER.H_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container
          sx={{
            height: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderContent}
        </Container>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}
