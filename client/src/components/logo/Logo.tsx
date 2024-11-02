import { memo } from 'react';

import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import RouterLink from "@/routes/components/RouterLink";
import Label from "@/components/label";
import Image from "@/components/image";

interface LogoProps extends BoxProps {
  single?: boolean;
}

function Logo({ single = false, sx }: LogoProps) {
  const theme = useTheme();

  const PRIMARY_MAIN = theme.palette.primary.main;

  const singleLogo = <Image
    alt="accounting"
    src="/assets/logo/elogo.svg"
    sx={{ width: 120, height: 120 }}
  />;

  const fullLogo = <Image
    alt="accounting"
    src="/assets/logo/elearning.svg"
    sx={{ width: 120, height: 120 }}
  />;

  return (
    <Link
      component={RouterLink}
      href="/"
      color="inherit"
      aria-label="go to homepage"
      sx={{ lineHeight: 0 }}
    >
      <Box
        sx={{
          width: single ? 60 : 120,
          lineHeight: 0,
          cursor: 'pointer',
          display: 'inline-flex',
          ...sx,
        }}
      >
        {single ? singleLogo : fullLogo}
      </Box>
    </Link>
  );
}

export default memo(Logo);
