import { useEffect } from 'react';

import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import NavList from './NavList';
import { NavProps } from '../utils/types';
import { NAV } from '../../../config-layout';
import {usePathname} from "@/routes/hooks";
import {useBoolean} from "@/hook/useBoolean";
import Iconify from "@/components/iconify";
import Logo from "@/components/logo/Logo";
import Scrollbar from "@/components/scrollbar";
import {paths} from "@/routes/path";

export default function NavMobile({ data }: NavProps) {
  const pathname = usePathname();

  const mobileOpen = useBoolean();

  useEffect(() => {
    if (mobileOpen.value) {
      mobileOpen.onFalse();
    }
  }, [pathname]);

  return (
    <>
      <IconButton onClick={mobileOpen.onTrue} sx={{ ml: 1, color: 'inherit' }}>
        <Iconify icon="carbon:menu" />
      </IconButton>

      <Drawer
        open={mobileOpen.value}
        onClose={mobileOpen.onFalse}
        PaperProps={{
          sx: {
            pb: 5,
            width: NAV.W_VERTICAL,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          <List component="nav" disablePadding>
            {data.map((list) => (
              <NavList key={list.title} data={list} />
            ))}
          </List>

          <Stack spacing={1.5} sx={{ p: 3 }}>
            <Button
              fullWidth
              variant="contained"
              color="inherit"
              href={paths.zoneStore}
              target="_blank"
              rel="noopener"
            >
              Đăng Ký
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              href={paths.zoneStore}
              target="_blank"
              rel="noopener"
            >
              Đăng Nhập
            </Button>
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
