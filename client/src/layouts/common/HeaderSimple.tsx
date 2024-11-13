import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/theme/css';
import { HEADER } from '../config-layout';
import HeaderShadow from "@/layouts/common/HeaderShadow";
import {useOffSetTop} from "@/hook/useOffSetTop";
import Logo from "@/components/logo/Logo";
import {paths} from "@/routes/path";
import RouterLink from "@/routes/components/RouterLink";

export default function HeaderSimple() {
  const theme = useTheme();

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offset && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Logo />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {/*<SettingsButton />*/}

          <Link
            href={paths.support}
            component={RouterLink}
            color="inherit"
            sx={{ typography: 'subtitle2' }}
          >
            Need help?
          </Link>
        </Stack>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}
