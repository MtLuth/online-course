"use client";

import { m } from "framer-motion";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import CompactLayout from "src/layouts/compact";

import Image from "src/components/image";
import RouterLink from "@/routes/components/RouterLink";
import MotionContainer from "@/components/animate/MotionContainer";
import { VarBounce } from "@/components/animate/VarBounce";

export default function Error500View() {
  return (
    <CompactLayout>
      <MotionContainer>
        <m.div variants={VarBounce().in}>
          <Typography variant="h3" paragraph>
            500 - Lỗi Máy Chủ Nội Bộ
          </Typography>
        </m.div>

        <m.div variants={VarBounce().in}>
          <Typography sx={{ color: "text.secondary" }}>
            Đã xảy ra lỗi, vui lòng thử lại sau.
          </Typography>
        </m.div>

        <m.div variants={VarBounce().in}>
          <Image
            alt="500"
            src="/assets/illustrations/illustration_500.svg"
            sx={{
              mx: "auto",
              maxWidth: 320,
              my: { xs: 5, sm: 8 },
            }}
          />
        </m.div>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          color="inherit"
          variant="contained"
        >
          Về Trang Chủ
        </Button>
      </MotionContainer>
    </CompactLayout>
  );
}
