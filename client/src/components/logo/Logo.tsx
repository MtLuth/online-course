import { memo } from "react";

import Link from "@mui/material/Link";
import Box, { BoxProps } from "@mui/material/Box";
import RouterLink from "@/routes/components/RouterLink";
import Image from "@/components/image";

interface LogoProps extends BoxProps {
  single?: boolean;
}

function Logo({ single = false, sx, ...rest }: LogoProps) {
  const singleLogo = (
    <Image
      alt="Accounting Logo"
      src="/assets/logo/elogo.svg"
      sx={{ width: 120, height: 120 }}
    />
  );

  const fullLogo = (
    <Image
      alt="Elearning Logo"
      src="/assets/logo/elearning.svg"
      sx={{ width: 120, height: 120 }}
    />
  );

  return (
    <Link
      component={RouterLink}
      href="/"
      color="inherit"
      aria-label="Go to homepage"
      sx={{ lineHeight: 0, textDecoration: "none" }}
      {...rest}
    >
      <Box
        sx={{
          width: single ? 60 : 120,
          lineHeight: 0,
          cursor: "pointer",
          display: "inline-flex",
          ...sx,
        }}
      >
        {single ? singleLogo : fullLogo}
      </Box>
    </Link>
  );
}

export default memo(Logo);
